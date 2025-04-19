import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Link } from "expo-router";
import { urls } from "@/constants/urls";
import axios from "axios";

export default function TopBar() {
  // Fetch all notifications
  const [notifications, setNotifications] = useState<undefined | any[]>();

  useEffect(() => {
    async function getNotifications() {
      if (!notifications) {
        const res = await axios.get(`${urls.backendUrl}/notifications`);

        setNotifications(res.data.notifications);
      }
    }

    getNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Smart Switch Mobile</Text>

      <View style={styles.link}>
        <Link href="/notifications">
          <Fontisto name="bell" size={24} color={colors.primary} />
        </Link>

        <Text style={styles.notificationNumber}>
          {notifications ? notifications?.length || 0 : 0}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    color: "white",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  link: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "white",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  notificationNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
  },
});
