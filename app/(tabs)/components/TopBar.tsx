import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "@/constants/colors";

export default function TopBar() {
  return (
    <View style={styles.container}>
      <Text>TopBar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    color: "white",
  },
});
