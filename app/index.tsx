import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";

export default function index() {
  const [username, setUsername] = useState("");

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.heading}>Login to Smart Switch Mobile</Text>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            label="Username"
            mode="outlined"
            placeholder="Sir Prosper"
            value={username}
            onChangeText={(username) => setUsername(username)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "100%",
  },
  input: {
    width: "100%",
  },
});
