import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CustomTooltip({
  text,
  next,
  previous,
  isFirstStep,
  isLastStep,
}: any) {
  return (
    <View style={s.tooltip}>
      <Text style={s.text}>{text}</Text>
      <View style={s.buttons}>
        {!isFirstStep && (
          <TouchableOpacity onPress={previous} style={s.btnSecondary}>
            <Text style={s.btnSecondaryText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={next} style={s.btnPrimary}>
          <Text style={s.btnPrimaryText}>{isLastStep ? "Done" : "Next"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  tooltip: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    width: 250,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 15,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btnPrimary: {
    backgroundColor: "#0145FE",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  btnPrimaryText: { color: "#fff", fontWeight: "600" },
  btnSecondary: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  btnSecondaryText: { color: "#333", fontWeight: "600" },
});
