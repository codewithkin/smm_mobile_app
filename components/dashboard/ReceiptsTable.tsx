import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { DataTable, Text, Button } from "react-native-paper";
import moment from "moment";
import ChartContainer from "../shared/ChartContainer";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { urls } from "@/constants/urls";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productId: string;
  checkoutId: string;
}

interface Checkout {
  id: string;
  total: number;
  createdAt: string;
  items: CheckoutItem[];
}

interface Props {
  data: Checkout[];
}

const ReceiptsTable: React.FC<Props> = ({ data }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const from = page * rowsPerPage;
  const to = Math.min((page + 1) * rowsPerPage, data.length);

  const paginatedData = data.slice(from, to);

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No receipts found.</Text>
        </View>
      </ChartContainer>
    );
  }

  const downloadReceipt = async (checkoutId: string) => {
    try {
      const response = await axios.get(
        `${urls.backendUrl}/checkout/${checkoutId}/download`,
        {
          responseType: "arraybuffer",
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to download receipt");
      }

      const base64String = arrayBufferToBase64(response.data);
      const fileUri = FileSystem.documentDirectory + `receipt-${checkoutId}.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, base64String, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert("Success", "Receipt downloaded successfully.");
      console.log("Receipt saved to:", fileUri);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return global.btoa(binary); // Use global.btoa instead of window in React Native
  };

  return (
    <ChartContainer>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ flex: 2.5 }}>Date</DataTable.Title>
          <DataTable.Title style={{ flex: 1.5 }} numeric>Total ($)</DataTable.Title>
          <DataTable.Title style={{ flex: 1 }} numeric># Items</DataTable.Title>
          <DataTable.Title style={{ flex: 1.5 }}>Action</DataTable.Title>
        </DataTable.Header>

        {paginatedData.map((checkout) => (
          <DataTable.Row key={checkout.id}>
            <DataTable.Cell style={{ flex: 2.5 }}>
              {moment(checkout.createdAt).format("MMM D")}
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 1.5 }} numeric>
              {checkout.total.toFixed(2)}
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 1 }} numeric>
              {checkout.items.length}
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 1.5 }}>
              <Button
                compact
                mode="outlined"
                onPress={() => downloadReceipt(checkout.id)}
              >
                Download
              </Button>
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(data.length / rowsPerPage)}
          onPageChange={(newPage) => setPage(newPage)}
          label={`${from + 1}-${to} of ${data.length}`}
          showFastPaginationControls
          numberOfItemsPerPage={rowsPerPage}
          style={styles.pagination}
        />
      </DataTable>
    </ChartContainer>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#555",
  },
  pagination: {
    justifyContent: "flex-start",
  },
});

export default ReceiptsTable;