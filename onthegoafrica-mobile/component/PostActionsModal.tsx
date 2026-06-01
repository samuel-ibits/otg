// components/PostActionsModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose?: () => void;
  onComplainSupport?: () => void;
  onBlockUser?: () => void;
  onReportPost?: () => void;
  postTitle?: string; // optional context
  username?: string;  // optional context
};

export default function PostActionsModal({
  visible,
  onClose,
  onComplainSupport,
  onBlockUser,
  onReportPost,
  postTitle,
  username,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Floating close */}
          <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.8}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={s.title}>More options</Text>
          {postTitle ? <Text style={s.sub}>{postTitle}</Text> : null}
          {username ? <Text style={s.subMuted}>by @{username}</Text> : null}

          {/* Actions */}
          <View style={s.list}>
            <ActionRow
              emoji="🛟"
              label="Complain to support"
              desc="Tell support what went wrong"
              onPress={onComplainSupport}
            />
            <Divider />
            <ActionRow
              emoji="🚫"
              label="Block user"
              desc="Hide posts and messages from this user"
              onPress={onBlockUser}
              danger
            />
            <Divider />
            <ActionRow
              emoji="🚩"
              label="Report post"
              desc="Flag this post for review"
              onPress={onReportPost}
              danger
            />
          </View>

          {/* Footer cancel */}
          <TouchableOpacity style={s.cancel} onPress={onClose} activeOpacity={0.9}>
            <Text style={s.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- small bits ---------- */

function ActionRow({
  emoji,
  label,
  desc,
  onPress,
  danger,
}: {
  emoji: string;
  label: string;
  desc?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.9}>
      <Text style={s.emoji}>{emoji}</Text>
      <View style={s.rowText}>
        <Text style={[s.rowLabel, danger && s.rowDanger]}>{label}</Text>
        {desc ? <Text style={s.rowDesc}>{desc}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={s.divider} />;
}

/* ---------- styles ---------- */

const BLUE = '#0A59FF';
const TEXT = '#0A1220';
const MUTED = '#6C7A92';
const BORDER = '#E6ECF5';
const DANGER = '#B91C1C';
const BG = '#FFFFFF';

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: BG,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 18,
  },

  // close
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF4FB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  closeX: { fontSize: 24, lineHeight: Platform.OS === 'ios' ? 24 : 26, color: '#617291' },

  title: {
    color: TEXT,
    fontFamily: 'RCB-Bold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 6,
  },
  sub: {
    color: TEXT,
    fontFamily: 'RCB-SemiBold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  subMuted: {
    color: MUTED,
    fontFamily: 'RCB-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },

  list: {
    marginTop: 14,
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  emoji: { fontSize: 18, marginRight: 10 },
  rowText: { flex: 1 },
  rowLabel: { color: TEXT, fontFamily: 'RCB-SemiBold', fontSize: 15 },
  rowDesc: { color: MUTED, fontFamily: 'RCB-Regular', fontSize: 12, marginTop: 2 },
  rowDanger: { color: DANGER },

  divider: { height: 1, backgroundColor: BORDER },

  cancel: {
    marginTop: 14,
    height: 54,
    borderRadius: 27,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { color: '#FFF', fontFamily: 'RCB-SemiBold', fontSize: 16 },
});
