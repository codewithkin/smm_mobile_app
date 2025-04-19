import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { DataTable, Text, Button } from "react-native-paper";
import moment from "moment";
import ChartContainer from "../shared/ChartContainer";

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

  return (
    <ChartContainer>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ flex: 2 }}>Date</DataTable.Title>
          <DataTable.Title numeric>Total ($)</DataTable.Title>
          <DataTable.Title numeric># Items</DataTable.Title>
          <DataTable.Title>Action</DataTable.Title>
        </DataTable.Header>

        {paginatedData.map((checkout) => (
          <DataTable.Row key={checkout.id}>
            <DataTable.Cell style={{ flex: 2 }}>
              {moment(checkout.createdAt).format("MMM D, YYYY")}
            </DataTable.Cell>
            <DataTable.Cell numeric>{checkout.total.toFixed(2)}</DataTable.Cell>
            <DataTable.Cell numeric>{checkout.items.length}</DataTable.Cell>
            <DataTable.Cell>
              <Button
                compact
                mode="outlined"
                onPress={() => console.log("Download", checkout.id)}
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
