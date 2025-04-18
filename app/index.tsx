import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";

export default function index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
          <TextInput
            style={styles.input}
            label="Password"
            mode="outlined"
            placeholder="Enter your password"
            secureTextEntry={true}
            value={password}
            onChangeText={(password) => setPassword(password)}
          />
          <Button style={styles.submitButton} mode="contained">
            Login
          </Button>
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
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "100%",
  },
  input: {
    width: "100%",
  },
  submitButton: {
    marginTop: 8,
  },
});
