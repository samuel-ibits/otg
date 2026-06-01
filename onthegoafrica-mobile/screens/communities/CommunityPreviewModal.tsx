import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

type Visibility = "Public" | "Private";

export type CommunityPreview = {
  name: string;
  members: number;
  visibility: Visibility;
  cover?: any;        // ImageSourcePropType
  description?: string;
  createdBy?: { name: string; avatar?: any; date?: string }; // date as string
};

export default function CommunityPreviewModal({
  visible,
  community,
  onJoin,
  onClose,
}: {
  visible: boolean;
  community: CommunityPreview;
  onJoin: () => void;
  onClose: () => void;
}) {
  const isPublic = community.visibility === "Public";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Close */}
          <TouchableOpacity style={s.close} onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={s.closeX}>×</Text>
          </TouchableOpacity>

          {/* Cover */}
          <View style={s.coverCircle}>
            {community.cover ? (
              <Image source={community.cover} style={s.coverImg} />
            ) : (
              <View style={s.coverFallback}>
                <Text style={s.coverFallbackTxt}>{initials(community.name)}</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={s.title} numberOfLines={2}>
            {community.name}
          </Text>

          {/* Meta */}
          <View style={s.metaRow}>
            <View style={s.metaLeft}>
              <Text style={s.linkIcon}>⛓️</Text>
              <Text style={s.metaText}>{community.members} Members</Text>
            </View>

            <View
              style={[
                s.pill,
                { backgroundColor: isPublic ? "#E8FBEF" : "#FFF6DB" },
              ]}
            >
              <View
                style={[
                  s.dot,
                  { backgroundColor: isPublic ? "#25C067" : "#F4C21D" },
                ]}
              />
              <Text
                style={[
                  s.pillText,
                  { color: isPublic ? "#199E54" : "#B88600" },
                ]}
              >
                {community.visibility}
              </Text>
            </View>
          </View>

          {/* Description */}
          {community.description ? (
            <Text style={s.desc} numberOfLines={3}>
              {community.description}
            </Text>
          ) : (
            <Text style={s.desc} numberOfLines={3}>
              Lorem ipsum dolor sit amet consectetur. Urna odio non blandit
              feugiat et nulla.
            </Text>
          )}

          {/* Created by */}
          {(community.createdBy?.name || community.createdBy?.date) && (
            <View style={s.createdRow}>
              <Text style={s.createdLabel}>Created by:</Text>
              {community.createdBy?.avatar ? (
                <Image source={community.createdBy.avatar} style={s.creatorAvatar} />
              ) : (
                <View style={[s.creatorAvatar, { backgroundColor: "#E6EEFA", alignItems: "center", justifyContent: "center" }]}>
                  <Text style={{ color: "#506384", fontWeight: "700" }}>
                    {initials(community.createdBy?.name || "U")}
                  </Text>
                </View>
              )}
              <Text style={s.creatorName} numberOfLines={1}>
                {community.createdBy?.name || "Unknown"}
              </Text>
              {community.createdBy?.date ? (
                <>
                  <Text style={s.dotSep}>•</Text>
                  <Text style={s.createdDate}>{community.createdBy.date}</Text>
                </>
              ) : null}
            </View>
          )}

          {/* CTA */}
          <TouchableOpacity style={s.cta} onPress={onJoin} activeOpacity={0.9}>
            <Text style={s.ctaText}>Join Community</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* utils */
function initials(t: string) {
  const p = t.trim().split(/\s+/);
  return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase();
}

/* styles */

const BLUE = "#0A59FF";
const TEXT = "#0A1220";
const MUTED = "#6C7A92";

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 26,
    alignItems: "center",
  },

  close: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FB",
    alignItems: "center",
    justifyContent: "center",
  },
  closeX: { fontSize: 22, color: "#617291", lineHeight: 22 },

  coverCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: "hidden",
    backgroundColor: "#F1F6FD",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 14,
  },
  coverImg: { width: "100%", height: "100%" },
  coverFallback: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  coverFallbackTxt: { color: "#7C8CA5", fontSize: 24, fontWeight: "700" },

  title: {
    color: TEXT,
    fontSize: 22,
    fontFamily: "RCB-Bold",
    textAlign: "center",
  },

  metaRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metaLeft: { flexDirection: "row", alignItems: "center" },
  linkIcon: { fontSize: 12, color: "#7C8CA5", marginRight: 6 },
  metaText: { color: "#8A9AB7", fontFamily: "RCB-Medium" },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  pillText: { fontFamily: "RCB-SemiBold", fontSize: 13 },

  desc: {
    marginTop: 10,
    textAlign: "center",
    color: MUTED,
    fontFamily: "RCB-Regular",
    lineHeight: 20,
    maxWidth: 300,
  },

  createdRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  createdLabel: { color: MUTED, fontFamily: "RCB-Medium" },
  creatorAvatar: { width: 20, height: 20, borderRadius: 10, marginLeft: 2 },
  creatorName: { color: TEXT, fontFamily: "RCB-SemiBold" },
  dotSep: { color: "#B6C3D9", marginHorizontal: 2 },
  createdDate: { color: "#8FA1BE", fontFamily: "RCB-Regular" },

  cta: {
    marginTop: 18,
    alignSelf: "stretch",
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "#FFFFFF", fontFamily: "RCB-SemiBold", fontSize: 16 },
});
