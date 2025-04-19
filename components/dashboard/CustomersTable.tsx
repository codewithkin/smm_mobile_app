import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { DataTable, Text } from "react-native-paper";
import moment from "moment";
import ChartContainer from "../shared/ChartContainer";

interface Customer {
  id: string;
  name: string;
  address: string;
  spent?: number;
  customerSince?: string;
  lastPurchase?: string;
  purchases: any[];
}

interface Props {
  data: Customer[];
}

const rowsPerPageOptions = [5, 10, 15];

const CustomersTable: React.FC<Props> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage,
  );

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No customers found.</Text>
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
              <DataTable.Title style={{ width: 150 }}>Name</DataTable.Title>
              <DataTable.Title style={{ width: 200 }}>Address</DataTable.Title>
              <DataTable.Title style={{ width: 100 }}>
                Spent ($)
              </DataTable.Title>
              <DataTable.Title style={{ width: 160 }}>
                Customer Since
              </DataTable.Title>
              <DataTable.Title style={{ width: 160 }}>
                Last Purchase
              </DataTable.Title>
            </DataTable.Header>

            <ScrollView style={{ maxHeight: 250 }}>
              {paginatedData.map((customer) => (
                <DataTable.Row key={customer.id}>
                  <DataTable.Cell style={{ width: 150 }}>
                    {customer.name}
                  </DataTable.Cell>
                  <DataTable.Cell style={{ width: 200 }}>
                    {customer.address}
                  </DataTable.Cell>
                  <DataTable.Cell style={{ width: 100 }}>
                    {customer.spent ?? 0}
                  </DataTable.Cell>
                  <DataTable.Cell style={{ width: 160 }}>
                    {customer.customerSince
                      ? moment(customer.customerSince).format("MMM D, YYYY")
                      : "-"}
                  </DataTable.Cell>
                  <DataTable.Cell style={{ width: 160 }}>
                    {customer.lastPurchase
                      ? moment(customer.lastPurchase).format("MMM D, YYYY")
                      : "-"}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </ScrollView>

            {/* Pagination aligned to start */}
            <View style={{ alignItems: "flex-start" }}>
              <DataTable.Pagination
                page={page}
                numberOfPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
                label={`${page * rowsPerPage + 1}-${Math.min(
                  (page + 1) * rowsPerPage,
                  data.length,
                )} of ${data.length}`}
                optionsPerPage={rowsPerPageOptions}
                itemsPerPage={rowsPerPage}
                setItemsPerPage={setRowsPerPage}
                showFastPaginationControls
                optionsLabel={"Rows per page"}
              />
            </View>
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
  emptyText: {
    fontSize: 14,
    color: "#555",
  },
});

export default CustomersTable;
