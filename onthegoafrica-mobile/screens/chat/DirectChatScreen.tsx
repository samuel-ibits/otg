import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type Msg = {
  id: string;
  me?: boolean;
  text?: string;
  time?: string;     // "09:30 am"
  stamp?: boolean;   // renders the small timestamp chip
};

const AVATAR = require("../../assets/feed/user1.png");

const SEED: Msg[] = [
  { id: "s1", stamp: true, time: "09:33 am" },
  { id: "m1", text: "Hello" },
  {
    id: "m2",
    text: "Lorem ipsum dolor sit amet consectetur. Morbi facilisis vel.",
  },
  { id: "s2", stamp: true, time: "09:30 am" },
  { id: "m3", me: true, text: "Hello goodafternoon" },
  {
    id: "m4",
    me: true,
    text:
      "Lorem ipsum dolor sit amet consectetur. Morbi ipsum quis a et at enim cras. Vitae pharetra pulvinar tellus turpis ornare fringilla enim in.",
  },
];

export default function DirectChatScreen({ navigation, route }: any) {
  const listRef = useRef<FlatList<Msg>>(null);
  const [msgs, setMsgs] = useState<Msg[]>(SEED);
  const [draft, setDraft] = useState("");

  const name = route?.params?.name ?? "Jared";
  const avatar = route?.params?.avatar ?? AVATAR;

  const scrollToEnd = () =>
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 0);

  useEffect(() => {
    scrollToEnd();
  }, []);

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setMsgs((m) => [...m, { id: String(Date.now()), me: true, text: t }]);
    setDraft("");
    scrollToEnd();
  };

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack?.()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <Image source={avatar} style={s.headerAvatar} />
        <Text style={s.headerName} numberOfLines={1}>
          {name}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 6 : 0}
      >
        {/* Messages */}
        <FlatList
          ref={listRef}
          data={msgs}
          keyExtractor={(x) => x.id}
          contentContainerStyle={{ padding: 12, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
          renderItem={({ item }) =>
            item.stamp ? (
              <Stamp time={item.time || ""} />
            ) : item.me ? (
              <Right msg={item} />
            ) : (
              <Left msg={item} />
            )
          }
        />

        {/* Composer */}
        <View style={s.composer}>
         
          <View style={s.inputWrap}>
            <TextInput
              style={s.input}
              placeholder="type a message"
              placeholderTextColor="#9AA8BE"
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={send}
              returnKeyType="send"
            />
          </View>
          <TouchableOpacity style={s.circleBtn} onPress={send}>
          

              <Image
                                        source={require('../../assets/icons/Camera-2.png')}
                                        style={s.cameraIcon}
                                        resizeMode="contain"
                                    />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* subcomponents */

function Stamp({ time }: { time: string }) {
  return (
    <View style={s.stamp}>
      <Text style={s.stampTxt}>{time}</Text>
    </View>
  );
}

function Left({ msg }: { msg: Msg }) {
  return (
    <View style={s.leftRow}>
      <View style={s.leftBubble}>
        {!!msg.text && <Text style={s.leftTxt}>{msg.text}</Text>}
      </View>
      <View style={s.tail}>
        <Text style={s.tailTxt}>T</Text>
      </View>
    </View>
  );
}

function Right({ msg }: { msg: Msg }) {
  return (
    <View style={s.rightRow}>
      <View style={s.rightBubble}>
        {!!msg.text && <Text style={s.rightTxt}>{msg.text}</Text>}
      </View>
      <View style={s.tail}>
        <Text style={s.tailTxt}>T</Text>
      </View>
    </View>
  );
}

/* styles */

const BLUE = "#0A59FF";
const TEXT = "#0A1220";
const L_BUBBLE = "#EDEFF5";
const R_BUBBLE = "#0A59FF";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6ECF5",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  back: { fontSize: 26, lineHeight: 26, color: TEXT, marginRight: 6 },
  headerAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  headerName: { color: TEXT, fontFamily: "RCB-SemiBold", fontSize: 16 },

  /* stamp chip */
  stamp: {
    alignSelf: "center",
    backgroundColor: "#EEF3F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginVertical: 4,
  },
  stampTxt: { color: "#8EA0BB", fontSize: 11, fontFamily: "RCB-Medium" },

  /* message rows */
  leftRow: { alignSelf: "flex-start", maxWidth: "78%", marginVertical: 4, flexDirection: "row", alignItems: "flex-end" },
  rightRow: { alignSelf: "flex-end", maxWidth: "78%", marginVertical: 4, flexDirection: "row", alignItems: "flex-end" },

  leftBubble: {
    backgroundColor: L_BUBBLE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderBottomLeftRadius: 6,
  },
  rightBubble: {
    backgroundColor: R_BUBBLE,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderBottomRightRadius: 6,
  },
  leftTxt: { color: TEXT, lineHeight: 20, fontFamily: "RCB-Regular" },
  rightTxt: { color: "#FFFFFF", lineHeight: 20, fontFamily: "RCB-Regular" },

  tail: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EFF3F9",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  tailTxt: { color: "#7C8CA5", fontSize: 12, fontFamily: "RCB-Bold" },

  /* composer */
  composer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E6ECF5",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF3F9",
    alignItems: "center",
    justifyContent: "center",
  },
  plus: { fontSize: 18, color: TEXT },
  camera: { fontSize: 18, color: TEXT },

  inputWrap: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF3F9",
    borderWidth: 1,
    borderColor: "#E5EDF7",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  input: { color: TEXT, fontFamily: "RCB-Regular" },
      cameraIcon: {
        width: 20,
        height: 20,
        tintColor: TEXT,
    },
});
