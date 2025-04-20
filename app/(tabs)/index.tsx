import TopBar from "../../components/TopBar";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import axios from "axios";
import { urls } from "@/constants/urls";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import { FAB, Text } from "react-native-paper";
import SalesLineChart from "@/components/dashboard/SalesLineChart";
import ProductsByCategoryChart from "@/components/dashboard/ProductsByCategoryChart";
import CustomersTable from "@/components/dashboard/CustomersTable";
import ReceiptsTable from "@/components/dashboard/ReceiptsTable";
import { router } from "expo-router";
import NewProductFAB from "@/components/shared/NewProductFAB";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<null | any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${urls.backendUrl}/data`);

        console.log("Backend data: ", res.data);

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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
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
                    style={[styles.gradientCard, { width: "47%" }]}
                  >
                    {/* Icon */}
                    <FontAwesome6 name="bag-shopping" size={32} color="white" />

                    {/* Number */}
                    {data ? (
                      <Text style={styles.dataKey}>
                        {data?.customers.length}
                      </Text>
                    ) : (
                      <Text style={styles.dataKey}>0</Text>
                    )}

                    {/* Title */}
                    <Text style={styles.cardHeading}>Customers</Text>
                  </LinearGradient>

                  {/* Products */}
                  <LinearGradient
                    colors={[colors.turquoise, colors.green]}
                    style={[styles.gradientCard, { width: "47%" }]}
                  >
                    {/* Icon */}
                    <FontAwesome6 name="bag-shopping" size={32} color="white" />

                    {/* Number */}
                    {data ? (
                      <Text style={styles.dataKey}>
                        {data?.products.length}
                      </Text>
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

                {/* Line chart showing sales */}
                {data.checkouts && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <SalesLineChart sales={data.checkouts} />
                  </ScrollView>
                )}

                {/* Bar chart showing products by category */}
                {data.products && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <ProductsByCategoryChart products={data.products} />
                  </ScrollView>
                )}

                {data?.customers && <CustomersTable data={data.customers} />}

                {data?.checkouts && <ReceiptsTable data={data.checkouts} />}
              </View>
            )}
          </MotiView>
        </View>
      </ScrollView>

      <NewProductFAB />
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
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
