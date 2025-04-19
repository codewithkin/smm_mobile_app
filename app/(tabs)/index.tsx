import TopBar from "../../components/TopBar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import axios from "axios";
import { urls } from "@/constants/urls";
import { Text } from "react-native-paper";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<null | any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${urls.backendUrl}/data`);
        setData(res.data);
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.primary,
        height: "100%",
      }}
    >
      <View style={styles.container}>
        <TopBar />

        {/* Home content with animation */}
        <MotiView
          from={{ opacity: 0, translateY: 200 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 1000 }}
          style={styles.content}
        >
          {loading ? (
            <View style={styles.skeletonContainer}>
              <View style={styles.skeletonCard} />
              <View style={styles.skeletonCard} />
              <View style={styles.skeletonCard} />
            </View>
          ) : (
            <View style={styles.dataContainer}>
              <Text variant="titleMedium">
                Total Customers: {data?.customers.length}
              </Text>
              <Text variant="titleMedium">
                Total Products: {data?.products.length}
              </Text>
              <Text variant="titleMedium">
                Total Sales: {data?.checkouts.length}
              </Text>
              {/* Add more insights or cards here */}
            </View>
          )}
        </MotiView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  content: {
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    marginTop: 24,
    padding: 24,
  },
  skeletonContainer: {
    gap: 12,
  },
  skeletonCard: {
    height: 80,
    backgroundColor: "#eee",
    borderRadius: 16,
  },
  dataContainer: {
    gap: 12,
  },
});
