import TopBar from "../../components/TopBar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import axios from "axios";
import { urls } from "@/constants/urls";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
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
              <View style={styles.twinGrid}>
                {/* Customers */}
                <LinearGradient
                  colors={[colors.red, colors.purple]}
                  style={[styles.gradientCard, {width: "45%"}]}
                >
                  {/* Icon */}
                  <FontAwesome6 name="bag-shopping" size={32} color="white" />

                  {/* Number */}
                  {data ? (
                    <Text style={styles.dataKey}>{data?.customers.length}</Text>
                  ) : (
                    <Text style={styles.dataKey}>0</Text>
                  )}

                  {/* Title */}
                  <Text style={styles.cardHeading}>Customers</Text>
                </LinearGradient>

                {/* Products */}
                <LinearGradient
                  colors={[colors.turquoise, colors.green]}
                  style={[styles.gradientCard, {width: "45%"}]}
                    
                >
                  {/* Icon */}
                  <FontAwesome6 name="bag-shopping" size={32} color="white" />

                  {/* Number */}
                  {data ? (
                    <Text style={styles.dataKey}>{data?.products.length}</Text>
                  ) : (
                    <Text style={styles.dataKey}>0</Text>
                  )}

                  {/* Title */}
                  <Text style={styles.cardHeading}>Products</Text>
                </LinearGradient>
              </View>

              {/* All-time sales */}
              <LinearGradient
                colors={[colors.purple, colors.secondary]}
                style={styles.gradientCard}
              >
                {/* Icon */}
                <MaterialCommunityIcons
                  name="cash-check"
                  size={32}
                  color="white"
                />

                {/* Number */}
                {data ? (
                  <Text style={styles.dataKey}>{data?.checkouts.length}</Text>
                ) : (
                  <Text style={styles.dataKey}>0</Text>
                )}

                {/* Title */}
                <Text style={styles.cardHeading}>Sales</Text>
              </LinearGradient>
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
  gradientCard: {
    borderRadius: 24,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: "white",
  },
  dataKey: {
    color: "white",
    fontWeight: "800",
    fontSize: 32,
    textAlign: "center",
  },
  cardHeading: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  twinGrid: {
    flexDirection: "row",
    gap: 16
  }
});
