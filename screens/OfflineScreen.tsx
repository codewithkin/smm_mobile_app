import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, Icon } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";

const OfflineScreen: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  const [checking, setChecking] = useState(false);

  const handleRetry = async () => {
    setChecking(true);
    const state = await NetInfo.fetch();
    if (state.isConnected && onRetry) {
      onRetry(); // let the wrapper handle re-render
    }
    setChecking(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/icon.png")} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Icon source="wifi-off" size={72} color="#e74c3c" style={styles.icon} />
      <Text style={styles.title}>You're Offline</Text>
      <Text style={styles.subtitle}>
        Please check your internet connection and try again.
      </Text>
      <Button
        mode="contained"
        onPress={handleRetry}
        loading={checking}
        style={styles.button}
      >
        Retry
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  logo: {
    width: 140,
    height: 50,
    marginBottom: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#e74c3c", // Brand red (customize as needed)
  },
});

export default OfflineScreen;
