import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function PlacesToVisitBlock({
  items,
  onEdit,
}: {
  items: string[];
  onEdit: () => void;
}) {
  return (
    <View style={s.card}>
      <View style={s.row}>
        <Text style={s.title}>Places to visit</Text>
        <TouchableOpacity onPress={onEdit}>
          <Text style={s.edit}>✎ Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={s.pills}>
        {items.map((t, i) => (
          <View key={i} style={s.pill}>
            <Text style={s.pillTxt}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#F7FAFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6EDF7",
    padding: 14,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: "#0A1220", fontFamily: "RCB-Bold", fontSize: 22 },
  edit: { color: "#0145FE", fontFamily: "RCB-SemiBold" },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#CDD9EE",
    backgroundColor: "#FFFFFF",
  },
  pillTxt: { color: "#0A1220", fontFamily: "RCB-SemiBold" },
});
