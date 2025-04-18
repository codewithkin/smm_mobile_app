import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { Toast } from "toastify-react-native";
import axios from "axios";
import { urls } from "@/constants/urls";
import { router } from "expo-router";

export default function index() {
  // Track form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Track loading state
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);

      // Make a request to the backend
      const res = await axios.post(
        `${urls.backendUrl}/auth/login`,
        {
          username,
          password,
        },
        {
          validateStatus: (status) => status < 500, // Treat 4xx as non-throwing
        },
      );

      // If the request was not successful
      if (res.status !== 200) {
        return Toast.error(res.data.message);
      }

      // Otherwise...redirect to dashboard
      router.push("/dashboard");
    } catch (e) {
      console.log("An error occured while signing user in: ", e);

      // Show an error toast
      Toast.error("Sorry, we couldn't sign you in...please try again later...");
    } finally {
      setLoading(false);
    }
  };

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
          <Button
            onPress={handleSignIn}
            disabled={username.length < 1 || password.length < 1 || loading}
            style={styles.submitButton}
            mode="contained"
          >
            {loading && (
              <ActivityIndicator style={{ marginRight: 4 }} size={14} />
            )}
            {loading ? "Logging you in..." : "Login"}
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
