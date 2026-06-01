// services/WifiScanService.ts
// Android-only Wi-Fi scan service using react-native-wifi-reborn.
// Expo Go won't work. Use a Dev Client or EAS build.

import { Platform, PermissionsAndroid } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

export type WifiHit = {
  ssid: string;
  bssid?: string;
  level?: number;       // RSSI (dBm)
  frequency?: number;   // MHz
  secure?: boolean;     // true if WPA/WEP present
  capabilities?: string;
};

export type WifiActivity =
  | { type: 'scan_started'; message: string }
  | { type: 'scan_done'; message: string; meta: { count: number } }
  | { type: 'new_networks'; message: string; meta: { new: WifiHit[]; total: number } }
  | { type: 'error'; message: string };

type Listener = (a: WifiActivity) => void;

const listeners = new Set<Listener>();
export const WifiScanEvents = {
  onActivity(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emit(a: WifiActivity) {
    for (const l of Array.from(listeners)) {
      try { l(a); } catch {}
    }
  },
};

type Config = {
  intervalMs?: number;        // default 15000
  announceNewOnly?: boolean;  // default true
  log?: boolean;              // default true (console logs)
};

class WifiScanServiceImpl {
  private timer: any = null;
  private inFlight = false;
  private running = false;
  private seen = new Set<string>();
  private cfg: Required<Config> = { intervalMs: 15000, announceNewOnly: true, log: true };

  async configure(cfg?: Config) {
    this.cfg = { ...this.cfg, ...(cfg ?? {}) };
    if (this.cfg.log) {
      console.log('[WifiScanService] configured:', this.cfg);
    }
  }

  async startAsync() {
    if (this.running) return;
    if (Platform.OS !== 'android') {
      this.warn('Android only. iOS cannot scan nearby Wi-Fi.');
      return;
    }
    const ok = await this.ensurePermissions();
    if (!ok) {
      this.error('Permissions denied. Enable location and nearby Wi-Fi.');
      return;
    }
    this.running = true;
    this.tick(); // immediate
    this.timer = setInterval(() => this.tick(), this.cfg.intervalMs);
    if (this.cfg.log) console.log('[WifiScanService] started');
  }

  async stopAsync() {
    this.running = false;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    this.inFlight = false;
    if (this.cfg.log) console.log('[WifiScanService] stopped');
  }

  // ===== internals =====

  private async ensurePermissions(): Promise<boolean> {
    const wants: string[] = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ];
    // Android 13+
    const nearbyKey = (PermissionsAndroid as any).PERMISSIONS?.NEARBY_WIFI_DEVICES;
    if (nearbyKey) wants.push(nearbyKey);

    const results = await PermissionsAndroid.requestMultiple(wants);
    const granted = wants.every(k => results[k] === PermissionsAndroid.RESULTS.GRANTED);
    if (this.cfg.log) console.log('[WifiScanService] permissions:', results);
    return granted;
  }

  private key(n: WifiHit) {
    return n.bssid || `ssid:${n.ssid || '<hidden>'}`;
  }

  private async scanOnce(): Promise<WifiHit[]> {
    // Some devices need explicit rescan
    try { await WifiManager.reScanAndLoadWifiList(); } catch {}
    const raw = await WifiManager.loadWifiList();
    const list: WifiHit[] = (raw || []).map((r: any) => ({
      ssid: r.SSID,
      bssid: r.BSSID,
      level: typeof r.level === 'number' ? r.level : undefined,
      frequency: r.frequency,
      capabilities: r.capabilities,
      secure: !!String(r.capabilities || '').match(/WEP|WPA|WPA2|WPA3/),
    }));
    // Sort by strongest signal (desc)
    list.sort((a, b) => (b.level ?? -999) - (a.level ?? -999));
    return list;
  }

  private async tick() {
    if (!this.running || this.inFlight) return;
    this.inFlight = true;

    try {
      WifiScanEvents.emit({ type: 'scan_started', message: 'Scanning nearby Wi-Fi' });
      if (this.cfg.log) console.log('[WifiScanService] scan_started');

      const list = await this.scanOnce();

      WifiScanEvents.emit({ type: 'scan_done', message: 'Scan complete', meta: { count: list.length } });
      if (this.cfg.log) {
        console.log(`[WifiScanService] scan_done: found=${list.length}`);
        // Log a compact preview
        console.log(
          '[WifiScanService] sample:',
          list.slice(0, 5).map(n => ({
            ssid: n.ssid,
            bssid: n.bssid,
            level: n.level,
            locked: n.secure,
          }))
        );
      }

      let announce: WifiHit[];

      if (this.cfg.announceNewOnly) {
        announce = list.filter(n => !this.seen.has(this.key(n)));
      } else {
        announce = list;
      }

      // Update seen
      for (const n of list) this.seen.add(this.key(n));

      if (announce.length) {
        WifiScanEvents.emit({
          type: 'new_networks',
          message: `${announce.length} network(s)`,
          meta: { new: announce, total: list.length },
        });
        if (this.cfg.log) {
          console.log(
            '[WifiScanService] new_networks:',
            announce.map(n => ({
              ssid: n.ssid,
              bssid: n.bssid,
              level: n.level,
              locked: n.secure,
            }))
          );
        }
      } else {
        if (this.cfg.log) console.log('[WifiScanService] no new networks to announce');
      }
    } catch (e: any) {
      this.error(e?.message || 'Wi-Fi scan failed');
    } finally {
      this.inFlight = false;
    }
  }

  private error(msg: string) {
    if (this.cfg.log) console.warn('[WifiScanService] error:', msg);
    WifiScanEvents.emit({ type: 'error', message: msg });
  }

  private warn(msg: string) {
    if (this.cfg.log) console.warn('[WifiScanService] warn:', msg);
  }
}

export const WifiScanService = new WifiScanServiceImpl();

/*
Usage (Android):

import { WifiScanService, WifiScanEvents } from '../services/WifiScanService';

await WifiScanService.configure({ intervalMs: 20000, announceNewOnly: false, log: true });
await WifiScanService.startAsync();

const unsub = WifiScanEvents.onActivity((a) => {
  if (a.type === 'new_networks') {
    console.log('UI got networks:', a.meta.new);
  }
});

...on cleanup:
unsub();
WifiScanService.stopAsync();
*/
