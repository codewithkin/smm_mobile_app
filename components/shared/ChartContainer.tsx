import { StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";
import { colors } from "@/constants/colors";

export default function ChartContainer({ children }: { children: ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderColor: colors.purple,
    borderWidth: 1,
    borderRadius: 24,
    borderStyle: "dashed",
    width: "100%",
  },
});
