import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { DataTable } from "react-native-paper";
import { LineChart } from "react-native-gifted-charts";
import axios from "axios"; // Import axios
import { Dimensions } from "react-native";
import { urls } from "@/constants/urls";

const screenWidth = Dimensions.get("window").width;

export default function CustomersPage() {
  const [customersData, setCustomersData] = useState<null | any>(null);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace `urls.backendUrl` with your actual backend URL
        const response = await axios.get(`${urls.backendUrl}/checkout`);
        const data = response.data;

        setCustomersData(data.customers);
        setSalesData(data.sales); // Format the sales data for the chart
      } catch (error) {
        console.error("Error fetching customer data", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!customersData || !customersData.customers.length) {
    return <Text>No customers found.</Text>; // Handle empty customers data
  }

  const chartData = salesData.map((sale: any) => ({
    value: sale.total,
    label: sale.date,
    date: sale.date,
  }));

  return (
    <ScrollView style={styles.parent}>
      <View>
        <Text style={styles.heading}>Customers Page</Text>
        <Text style={styles.subheading}>
          Manage all of your business' customers
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>All Customers</Title>
            <Paragraph>{customersData.allCustomers}</Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Returning Customers</Title>
            <Paragraph>{customersData.returningCustomers}</Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Device Customers</Title>
            <Paragraph>{customersData.deviceCustomers}</Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Accessory Customers</Title>
            <Paragraph>{customersData.accessoryCustomers}</Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Total Received</Title>
            <Paragraph>{`$${customersData.totalReceived}`}</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.subheading}>Customer Sales for the Month</Text>
        {salesData.length > 0 ? (
          <LineChart
            data={chartData}
            width={screenWidth - 30}
            height={220}
            isAnimated
            hideDataPoints={false}
            yAxisLabel="$"
            yAxisSuffix="k"
            dataPointShape="circle"
            areaChart
            smooth
            showVerticalLines={false}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#f0f0f0",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 2,
              color: () => "#FF5733",
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
          />
        ) : (
          <Text>No sales data available.</Text> // Handle case where no sales data exists
        )}
      </View>

      <View>
        <Text style={styles.subheading}>All Customers</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Date Joined</DataTable.Title>
            <DataTable.Title>Last Purchase</DataTable.Title>
            <DataTable.Title>Amount Received</DataTable.Title>
          </DataTable.Header>

          {customersData.customers.map((customer: any, index: number) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{customer.name}</DataTable.Cell>
              <DataTable.Cell>{customer.dateJoined}</DataTable.Cell>
              <DataTable.Cell>{customer.lastPurchase}</DataTable.Cell>
              <DataTable.Cell>${customer.amountReceived}</DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Row>
            <DataTable.Cell>Total</DataTable.Cell>
            <DataTable.Cell></DataTable.Cell>
            <DataTable.Cell></DataTable.Cell>
            <DataTable.Cell>{`$${customersData.totalReceived}`}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  parent: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
  },
  subheading: {
    fontSize: 14,
    fontWeight: "400",
    color: "gray",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  card: {
    width: "48%",
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  chartContainer: {
    marginVertical: 20,
  },
});
