import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { DataTable, Text, IconButton } from "react-native-paper";
import moment from "moment";
import ChartContainer from "../shared/ChartContainer";

interface Receipt {
  id: string;
  customerName: string;
  total: number;
  date: string;
  downloadUrl: string;
}

interface Props {
  data: Receipt[];
}

const ReceiptsTable: React.FC<Props> = ({ data }) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  const paginatedData = data.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage,
  );
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleDownload = (url: string) => {
    // Implement download functionality here
    console.log(`Downloading receipt from: ${url}`);
  };

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <View style={styles.emptyContainer}>
          <Text>No receipts available.</Text>
        </View>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ScrollView horizontal>
        <View style={{ maxHeight: 350 }}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{ width: 200 }}>Customer</DataTable.Title>
              <DataTable.Title numeric style={{ width: 100 }}>
                Total ($)
              </DataTable.Title>
              <DataTable.Title style={{ width: 160 }}>Date</DataTable.Title>
              <DataTable.Title style={{ width: 80 }}>Download</DataTable.Title>
            </DataTable.Header>

            {paginatedData.map((receipt) => (
              <DataTable.Row key={receipt.id}>
                <DataTable.Cell style={{ width: 200 }}>
                  {receipt.customerName}
                </DataTable.Cell>
                <DataTable.Cell numeric style={{ width: 100 }}>
                  {receipt.total.toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 160 }}>
                  {moment(receipt.date).format("MMM D, YYYY")}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 80 }}>
                  <IconButton
                    icon="download"
                    size={20}
                    onPress={() => handleDownload(receipt.downloadUrl)}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              label={`${page * itemsPerPage + 1}-${Math.min((page + 1) * itemsPerPage, data.length)} of ${data.length}`}
              showFastPaginationControls
              style={{ alignSelf: "flex-start" }}
            />
          </DataTable>
        </View>
      </ScrollView>
    </ChartContainer>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
});

export default ReceiptsTable;
