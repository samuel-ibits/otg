// services/MovementTrackingService.ts
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---- Public API -------------------------------------------------------------

export type TrackingConfig = {
  apiUrl: string;                 // required. Where to POST the batch
  apiHeaders?: Record<string,string>; // optional headers e.g. auth
  windowOnMs?: number;            // default 3 min
  windowOffMs?: number;           // default 2 min
  distanceMeters?: number;        // location sample distance filter
  timeIntervalMs?: number;        // location sample time filter
  androidNotificationTitle?: string;
  androidNotificationBody?: string;
};

export const MovementTrackingService = {
  configure,
  startAsync,
  stopAsync,
  statusAsync,
};

// ---- Internals --------------------------------------------------------------

const TASK_NAME = 'movement-tracking-location-task';
const STORE_KEY_CFG = '@tracking/cfg';
const STORE_KEY_BUF = '@tracking/buffer';   // array of samples
const STORE_KEY_STATE = '@tracking/state';  // {active:boolean, onWindowEndsAt:number}

type Sample = {
  timestamp: number; // ms
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  speed?: number | null;   // m/s
};

type InternalCfg = Required<
  Pick<
    TrackingConfig,
    | 'apiUrl'
    | 'apiHeaders'
    | 'windowOnMs'
    | 'windowOffMs'
    | 'distanceMeters'
    | 'timeIntervalMs'
    | 'androidNotificationTitle'
    | 'androidNotificationBody'
  >
>;

const DEFAULT_CFG: InternalCfg = {
  apiUrl: '',
  apiHeaders: {},
  windowOnMs: 3 * 60 * 1000,
  windowOffMs: 2 * 60 * 1000,
  distanceMeters: 5,
  timeIntervalMs: 5_000,
  androidNotificationTitle: 'Tracking movement',
  androidNotificationBody: 'Collecting location for analytics',
};

let _cycleTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Configure service. Safe to call multiple times.
 */
async function configure(cfg: TrackingConfig) {
  console.log('[MovementTrackingService] configure() called with config:', cfg);
  const merged: InternalCfg = {
    ...DEFAULT_CFG,
    ...cfg,
    apiHeaders: cfg.apiHeaders ?? {},
  };
  if (!merged.apiUrl) throw new Error('MovementTrackingService.configure: apiUrl is required');
  await AsyncStorage.setItem(STORE_KEY_CFG, JSON.stringify(merged));
  console.log('[MovementTrackingService] Configuration saved successfully');
}

/**
 * Start background location updates and the ON/OFF cycle.
 * Requests permission if needed.
 */
async function startAsync() {
  console.log('[MovementTrackingService] startAsync() called');
  const cfg = await loadCfg();
  if (!cfg.apiUrl) throw new Error('MovementTrackingService.startAsync: call configure() first');

  console.log('[MovementTrackingService] Requesting location permissions...');
  // Permissions
  const { status } = await Location.requestForegroundPermissionsAsync();
  console.log('[MovementTrackingService] Foreground permission status:', status);
  if (status !== 'granted') throw new Error('Location permission denied');

  // Ask for background permission if you need true background
  const bg = await Location.requestBackgroundPermissionsAsync();
  console.log('[MovementTrackingService] Background permission status:', bg.status);
  if (bg.status !== 'granted') {
    console.log('[MovementTrackingService] Background location permission not granted, continuing with foreground only');
    // Not fatal if foreground-only usage is ok for your app
    // Throw if you want to enforce
    // throw new Error('Background location permission denied');
  }

  // Define the task exactly once
  defineLocationTask();

  // Start background updates if not running
  const running = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
  console.log('[MovementTrackingService] Location updates already running:', running);
  if (!running) {
    console.log('[MovementTrackingService] Starting location updates...');
    await Location.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: cfg.timeIntervalMs,
      distanceInterval: cfg.distanceMeters,
      // Android foreground service so sampling continues reliably
      foregroundService: {
        notificationTitle: cfg.androidNotificationTitle,
        notificationBody: cfg.androidNotificationBody,
      },
      // iOS tuning
      showsBackgroundLocationIndicator: true,
      pausesUpdatesAutomatically: false,
      activityType: Location.ActivityType.Fitness,
    });
    console.log('[MovementTrackingService] Location updates started successfully');
  }

  // Boot the cycle if not present
  const st = await getState();
  console.log('[MovementTrackingService] Current state:', st);
  if (!st) {
    const now = Date.now();
    const newState = { active: true, onWindowEndsAt: now + cfg.windowOnMs };
    console.log('[MovementTrackingService] No existing state, creating new state:', newState);
    await setState(newState);
    scheduleNextTick(cfg);
  } else {
    console.log('[MovementTrackingService] Using existing state, scheduling next tick');
    scheduleNextTick(cfg);
  }
}

/**
 * Stop updates and clear timers/state.
 */
async function stopAsync() {
  console.log('[MovementTrackingService] stopAsync() called');
  if (_cycleTimer) {
    console.log('[MovementTrackingService] Clearing cycle timer');
    clearTimeout(_cycleTimer);
    _cycleTimer = null;
  }
  const running = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
  console.log('[MovementTrackingService] Location updates running:', running);
  if (running) {
    console.log('[MovementTrackingService] Stopping location updates...');
    await Location.stopLocationUpdatesAsync(TASK_NAME);
    console.log('[MovementTrackingService] Location updates stopped');
  }
  await AsyncStorage.multiRemove([STORE_KEY_STATE, STORE_KEY_BUF]);
  console.log('[MovementTrackingService] Storage cleared, service fully stopped');
}

/**
 * Get lightweight status useful for UI.
 */
async function statusAsync() {
  console.log('[MovementTrackingService] statusAsync() called');
  const running = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
  const st = await getState();
  const buffer = await getBuffer();
  const status = {
    running,
    activeWindow: st?.active ?? false,
    windowEndsAt: st?.onWindowEndsAt ?? null,
    pendingSamples: buffer.length,
  };
  console.log('[MovementTrackingService] Current status:', status);
  return status;
}

// ---- Task + Cycle logic -----------------------------------------------------

function defineLocationTask() {
  console.log('[MovementTrackingService] defineLocationTask() called');
  // Only define once
  // @ts-ignore TaskManager.getTaskOptionsAsync exists at runtime; guard define
  if ((TaskManager as any)._definedTasks?.[TASK_NAME]) {
    console.log('[MovementTrackingService] Task already defined, skipping');
    return;
  }

  console.log('[MovementTrackingService] Defining new task:', TASK_NAME);
  TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
    console.log('[MovementTrackingService] Location task triggered');
    if (error) {
      console.error('[MovementTrackingService] Location task error:', error);
      return;
    }

    const payload = data as { locations?: Location.LocationObject[] } | undefined;
    const locs = payload?.locations ?? [];
    console.log(`[MovementTrackingService] Received ${locs.length} location samples`);

    if (!locs.length) return;

    const st = await getState();
    console.log('[MovementTrackingService] Current state in task:', st);
    if (!st?.active) {
      console.log('[MovementTrackingService] Not in active window, ignoring samples');
      return; // ignore samples outside ON window
    }

    // Map to compact sample type
    const samples: Sample[] = locs.map((l) => ({
      timestamp: new Date(l.timestamp).getTime(),
      latitude: l.coords.latitude,
      longitude: l.coords.longitude,
      altitude: l.coords.altitude ?? null,
      accuracy: l.coords.accuracy ?? null,
      speed: l.coords.speed ?? null,
    }));

    console.log('[MovementTrackingService] Processed samples:', samples);

    // Append to buffer
    const buf = await getBuffer();
    console.log(`[MovementTrackingService] Current buffer size: ${buf.length}, adding ${samples.length} samples`);
    buf.push(...samples);
    await setBuffer(buf);
    console.log(`[MovementTrackingService] Buffer updated, new size: ${buf.length}`);
  });
}

async function scheduleNextTick(cfg?: InternalCfg) {
  console.log('[MovementTrackingService] scheduleNextTick() called');
  const cfgResolved = cfg ?? (await loadCfg());
  const st = await getState();
  console.log('[MovementTrackingService] Current state for scheduling:', st);
  if (!st) {
    console.log('[MovementTrackingService] No state found, stopping scheduling');
    return; // stopped
  }

  const now = Date.now();
  const delay = Math.max(0, (st.active ? st.onWindowEndsAt : now) - now);
  console.log(`[MovementTrackingService] Scheduling next tick in ${delay}ms, active: ${st.active}`);

  if (_cycleTimer) {
    console.log('[MovementTrackingService] Clearing previous cycle timer');
    clearTimeout(_cycleTimer);
  }

  _cycleTimer = setTimeout(async () => {
    console.log('[MovementTrackingService] Cycle timer triggered');
    const s = await getState();
    console.log('[MovementTrackingService] State at cycle tick:', s);
    if (!s) {
      console.log('[MovementTrackingService] No state found, stopping cycle');
      return;
    }
    if (s.active) {
      console.log('[MovementTrackingService] ON window ending, flushing to API...');
      // End ON window → send and flip to OFF
      await flushToApi();
      const newState = { active: false, onWindowEndsAt: Date.now() + cfgResolved.windowOffMs };
      console.log('[MovementTrackingService] Switching to OFF window:', newState);
      await setState(newState);
    } else {
      console.log('[MovementTrackingService] OFF window ending, starting ON window...');
      // End OFF window → start ON
      const newState = { active: true, onWindowEndsAt: Date.now() + cfgResolved.windowOnMs };
      console.log('[MovementTrackingService] Switching to ON window:', newState);
      await setState(newState);
    }
    scheduleNextTick(cfgResolved);
  }, delay || 10);
}

async function flushToApi() {
  console.log('[MovementTrackingService] flushToApi() called');
  const cfg = await loadCfg();
  const buf = await getBuffer();
  console.log(`[MovementTrackingService] Buffer contains ${buf.length} samples before flush`);

  if (!buf.length) {
    console.log('[MovementTrackingService] Buffer empty, nothing to flush');
    return;
  }

  // Sort by time and dedupe adjacent identical coords
  buf.sort((a, b) => a.timestamp - b.timestamp);
  const compact: Sample[] = [];
  for (let i = 0; i < buf.length; i++) {
    const prev = compact[compact.length - 1];
    const cur = buf[i];
    if (
      !prev ||
      prev.latitude !== cur.latitude ||
      prev.longitude !== cur.longitude ||
      Math.abs(prev.timestamp - cur.timestamp) > 1000
    ) {
      compact.push(cur);
    }
  }

  console.log(`[MovementTrackingService] After deduplication: ${compact.length} samples`);

  try {
    console.log('[MovementTrackingService] Sending data to API:', cfg.apiUrl);
    const payload = {
      collectedAt: new Date().toISOString(),
      samples: compact,
    };
    console.log('[MovementTrackingService] API payload:', payload);

    const res = await fetch(cfg.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...cfg.apiHeaders,
      },
      body: JSON.stringify(payload),
    });
    
    console.log(`[MovementTrackingService] API response status: ${res.status}`);
    if (!res.ok) {
      // Keep buffer if failed
      console.error(`[MovementTrackingService] API error: ${res.status}`);
      throw new Error(`API ${res.status}`);
    }
    // Clear buffer only on success
    console.log('[MovementTrackingService] API call successful, clearing buffer');
    await setBuffer([]);
  } catch (error) {
    console.error('[MovementTrackingService] API call failed:', error);
    // Leave buffer for next attempt
    console.log('[MovementTrackingService] Keeping buffer for retry');
  }
}

// ---- Storage helpers --------------------------------------------------------

async function loadCfg(): Promise<InternalCfg> {
  console.log('[MovementTrackingService] loadCfg() called');
  const raw = await AsyncStorage.getItem(STORE_KEY_CFG);
  const cfg = raw ? { ...DEFAULT_CFG, ...JSON.parse(raw) } : DEFAULT_CFG;
  console.log('[MovementTrackingService] Loaded config:', cfg);
  return cfg;
}

async function getBuffer(): Promise<Sample[]> {
  console.log('[MovementTrackingService] getBuffer() called');
  const raw = await AsyncStorage.getItem(STORE_KEY_BUF);
  const buffer = raw ? (JSON.parse(raw) as Sample[]) : [];
  console.log(`[MovementTrackingService] Buffer loaded with ${buffer.length} samples`);
  return buffer;
}

async function setBuffer(arr: Sample[]) {
  console.log(`[MovementTrackingService] setBuffer() called with ${arr.length} samples`);
  await AsyncStorage.setItem(STORE_KEY_BUF, JSON.stringify(arr));
  console.log('[MovementTrackingService] Buffer saved to storage');
}

async function getState(): Promise<{ active: boolean; onWindowEndsAt: number } | null> {
  console.log('[MovementTrackingService] getState() called');
  const raw = await AsyncStorage.getItem(STORE_KEY_STATE);
  const state = raw ? (JSON.parse(raw) as { active: boolean; onWindowEndsAt: number }) : null;
  console.log('[MovementTrackingService] Loaded state:', state);
  return state;
}

async function setState(s: { active: boolean; onWindowEndsAt: number }) {
  console.log('[MovementTrackingService] setState() called with:', s);
  await AsyncStorage.setItem(STORE_KEY_STATE, JSON.stringify(s));
  console.log('[MovementTrackingService] State saved to storage');
}

export type MovementActivity = {
  type: 'started' | 'stopped' | 'location' | 'upload' | 'warning' | 'error';
  message: string;
  meta?: Record<string, any>;
  at?: number; // epoch ms
};

// Lightweight subscriber list
type Listener = (a: MovementActivity) => void;
const _listeners = new Set<Listener>();

export const MovementTrackingEvents = {
  onActivity(listener: Listener) {
    _listeners.add(listener);
    return () => _listeners.delete(listener);
  },
  emit(activity: MovementActivity) {
    for (const l of Array.from(_listeners)) {
      try { l({ at: Date.now(), ...activity }); } catch {}
    }
  },
};
