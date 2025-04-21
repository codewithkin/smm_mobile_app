import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { Card, Title, Paragraph, DataTable } from "react-native-paper";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { urls } from "@/constants/urls";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<any[]>([]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await axios.get(`${urls.backendUrl}/checkout`);
        console.log("Receipts: ", res.data.receipts);

        setReceipts(res.data.receipts);
      } catch (error) {
        console.error("Failed to fetch receipts:", error);
      }
    };

    fetchReceipts();
  }, []);

  const handleDownload = async (url: string) => {
    try {
      const fileUri = FileSystem.documentDirectory + "receipt.pdf";
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Receipts Page</Text>
      <Text style={styles.subheading}>View and manage all receipts</Text>

      {/* --- Receipt Table --- */}
      <Text style={[styles.subheading, { marginTop: 20 }]}>Receipts Table</Text>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title>ID</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Total</DataTable.Title>
          <DataTable.Title>Download</DataTable.Title>
        </DataTable.Header>

        {receipts.map((receipt, index) => (
          <DataTable.Row key={receipt.id}>
            <DataTable.Cell>{receipt.id.slice(0, 6)}</DataTable.Cell>
            <DataTable.Cell>
              {new Date(receipt.createdAt).toLocaleDateString()}
            </DataTable.Cell>
            <DataTable.Cell>${receipt.total}</DataTable.Cell>
            <DataTable.Cell>
              <TouchableOpacity
                onPress={() => handleDownload(receipt.downloadUrl)}
              >
                <FontAwesome5 name="download" size={18} color="#1890ff" />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>

      {/* --- Receipt Cards --- */}
      <Text style={[styles.subheading, { marginTop: 30 }]}>Receipts Cards</Text>
      <View style={styles.receiptCardContainer}>
        {receipts.map((receipt, index) => (
          <Card style={styles.receiptCard} key={receipt.id}>
            <Card.Content>
              <Title>Receipt #{receipt.id.slice(0, 6)}</Title>
              <Paragraph>
                Date: {new Date(receipt.createdAt).toLocaleDateString()}
              </Paragraph>
              <Paragraph>Total: ${receipt.total}</Paragraph>
              <TouchableOpacity
                onPress={() => handleDownload(receipt.downloadUrl)}
              >
                <View style={styles.downloadBtn}>
                  <FontAwesome5 name="download" size={16} color="white" />
                  <Text style={styles.downloadText}>Download</Text>
                </View>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 40,
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 30,
  },
  subheading: {
    fontSize: 14,
    fontWeight: "400",
    color: "gray",
    marginBottom: 10,
  },
  table: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  receiptCardContainer: {
    flex: 1,
    flexWrap: "wrap",
    gap: 15,
    marginTop: 15,
  },
  receiptCard: {
    backgroundColor: "#f6ffed",
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  downloadBtn: {
    marginTop: 10,
    backgroundColor: "#52c41a",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  downloadText: {
    color: "white",
    fontWeight: "600",
  },
});
