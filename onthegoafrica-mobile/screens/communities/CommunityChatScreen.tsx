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
    time?: string; // "09:30 am"
    stamp?: boolean; // renders a small timestamp chip
    avatar?: any;
};

const AV1 = require("../../assets/feed/user1.png");

const INITIAL: Msg[] = [
    { id: "s1", stamp: true, time: "09:30 am" },
    { id: "m1", me: true, text: "Hello goodafternoon", avatar: AV1 },
    {
        id: "m2",
        me: true,
        text:
            "Lorem ipsum dolor sit amet consectetur. Morbi ipsum quis a et at enim cras. Vitae pharetra pulvinar tellus turpis ornare fringilla enim in.",
        avatar: AV1,
    },
    { id: "s2", stamp: true, time: "09:33 am" },
    { id: "m3", text: "Hello", avatar: AV1 },
    {
        id: "m4",
        text: "Lorem ipsum dolor sit amet consectetur. Morbi facilisis vel.",
        avatar: AV1,
    },
    { id: "s3", stamp: true, time: "09:39 am" },
    { id: "m5", text: "Hello", avatar: AV1 },
    {
        id: "m6",
        text: "Lorem ipsum dolor sit amet consectetur. Morbi facilisis vel.",
        avatar: AV1,
    },
    { id: "s4", stamp: true, time: "09:30 am" },
    { id: "m7", me: true, text: "Hello goodafternoon", avatar: AV1 },
    {
        id: "m8",
        me: true,
        text:
            "Lorem ipsum dolor sit amet consectetur. Morbi ipsum quis a et at enim cras. Vitae pharetra pulvinar tellus turpis ornare fringilla enim in.",
        avatar: AV1,
    },
];

export default function CommunityChatScreen({ navigation, route }: any) {
    const [msgs, setMsgs] = useState<Msg[]>(INITIAL);
    const [draft, setDraft] = useState("");
    const listRef = useRef<FlatList<Msg>>(null);

    const scrollToEnd = () =>
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 0);

    useEffect(() => {
        scrollToEnd();
    }, []);

    const send = () => {
        const t = draft.trim();
        if (!t) return;
        const next: Msg = {
            id: String(Date.now()),
            me: true,
            text: t,
            avatar: AV1,
        };
        setMsgs((m) => [...m, next]);
        setDraft("");
        scrollToEnd();
    };

    const name: string = route?.params?.name ?? "Cozy Cafe Spots";
    const members: number = route?.params?.members ?? 500;
    const online: number = route?.params?.online ?? 60;

    return (
        <SafeAreaView style={s.root}>
            {/* Header */}
            <View style={s.header}>
                <View style={s.headerLeft}>
                    <TouchableOpacity onPress={() => navigation?.goBack?.()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Image
                            source={require('../../assets/icons/back.png')}
                            style={s.backIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                   <TouchableOpacity style={s.headerBtn} onPress={() => navigation?.navigate?.("CommunityInfo", { name })}>
                      <Image
                        source={require('../../assets/feed/user1.png')}
                        style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
                    />
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => navigation?.navigate?.("CommunityInfo", { name })}>
                        <View>
                        <Text style={s.title}>{name}</Text>
                        <Text style={s.sub}>{members} members, {online} Online</Text>
                    </View>
                   </TouchableOpacity>
                </View>

            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
            >
                {/* Messages */}
                <FlatList
                    ref={listRef}
                    data={msgs}
                    keyExtractor={(m) => m.id}
                    contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 12 }}
                    renderItem={({ item }) =>
                        item.stamp ? (
                            <Stamp time={item.time || ""} />
                        ) : item.me ? (
                            <BubbleRight msg={item} />
                        ) : (
                            <BubbleLeft msg={item} />
                        )
                    }
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={scrollToEnd}
                />

                {/* Composer */}
                <View style={s.composerWrap}>


                    <View style={s.inputWrap}>
                        <TextInput
                            style={s.input}
                            placeholder="type a message..."
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

/* ------- message row bits ------- */

function Stamp({ time }: { time: string }) {
    return (
        <View style={s.stampWrap}>
            <Text style={s.stampTxt}>{time}</Text>
        </View>
    );
}

function BubbleLeft({ msg }: { msg: Msg }) {
    return (
        <View style={s.rowLeft}>
            <Image source={msg.avatar} style={s.avatar} />
            <View style={s.leftBubble}>
                <Text style={s.leftTxt}>{msg.text}</Text>
            </View>
        </View>
    );
}

function BubbleRight({ msg }: { msg: Msg }) {
    return (
        <View style={s.rowRight}>
            <View style={s.rightBubble}>
                <Text style={s.rightTxt}>{msg.text}</Text>
            </View>
            <Image source={msg.avatar} style={s.avatarSmall} />
        </View>
    );
}

/* ------- styles ------- */

const BLUE = "#0A59FF";
const BG = "#FFFFFF";
const BUBBLE_L = "#F1F5FA";
const BUBBLE_R = "#0A59FF";
const TEXT_D = "#0A1220";

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    header: {
        height: 56,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E6EDF6",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    back: { fontSize: 26, lineHeight: 26, color: TEXT_D, marginRight: 8 },
    title: { color: TEXT_D, fontFamily: "RCB-SemiBold", fontSize: 16 },
    sub: { color: "#7F90AD", fontFamily: "RCB-Regular", fontSize: 12, marginTop: 2 },
    headerBtn: {
        width: 32, height: 32, borderRadius: 16, backgroundColor: "#EEF3F9",
        alignItems: "center", justifyContent: "center",
    },
    plus: { color: BLUE, fontSize: 20, lineHeight: 20 },

    /* messages */
    rowLeft: { flexDirection: "row", alignItems: "flex-end", marginVertical: 4, maxWidth: "80%" },
    rowRight: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginVertical: 4,
        maxWidth: "80%",
        alignSelf: "flex-end",
    },

    avatar: { width: 28, height: 28, borderRadius: 14, marginRight: 6 },
    avatarSmall: { width: 24, height: 24, borderRadius: 12, marginLeft: 6 },

    leftBubble: {
        backgroundColor: BUBBLE_L,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        borderBottomLeftRadius: 6,
    },
    leftTxt: { color: TEXT_D, fontFamily: "RCB-Regular", lineHeight: 20 },

    rightBubble: {
        backgroundColor: BUBBLE_R,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        borderBottomRightRadius: 6,
    },
    rightTxt: { color: "#FFFFFF", fontFamily: "RCB-Regular", lineHeight: 20 },

    stampWrap: {
        alignSelf: "center",
        backgroundColor: "#EEF3F9",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginVertical: 4,
    },
    stampTxt: { color: "#8EA0BB", fontFamily: "RCB-Medium", fontSize: 11 },

    /* composer */
    composerWrap: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E6EDF6",
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: BG,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    circleBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#EEF3F9",
        alignItems: "center",
        justifyContent: "center",
    },
    circleTxt: { color: TEXT_D, fontSize: 18, lineHeight: 18 },
    attach: { color: TEXT_D, fontSize: 18, lineHeight: 18 },
    cameraIcon: {
        width: 20,
        height: 20,
        tintColor: TEXT_D,
    },
    backIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
        tintColor: TEXT_D,
    },
    inputWrap: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#EEF3F9",
        borderWidth: 1,
        borderColor: "#E5EDF7",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        color: TEXT_D,
        fontFamily: "RCB-Regular",
    },
    inlineBtn: { paddingHorizontal: 6, paddingVertical: 4 },
    inlineIcon: { fontSize: 16 },
});
