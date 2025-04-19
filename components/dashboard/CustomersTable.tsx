import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
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

const CustomersTable: React.FC<Props> = ({ data }) => {
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
        <View>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell, { width: 150 }]}>
              Name
            </Text>
            <Text style={[styles.cell, styles.headerCell, { width: 200 }]}>
              Address
            </Text>
            <Text style={[styles.cell, styles.headerCell, { width: 100 }]}>
              Spent ($)
            </Text>
            <Text style={[styles.cell, styles.headerCell, { width: 160 }]}>
              Customer Since
            </Text>
            <Text style={[styles.cell, styles.headerCell, { width: 160 }]}>
              Last Purchase
            </Text>
          </View>

          {/* Table Body */}
          {data.map((customer) => (
            <View key={customer.id} style={styles.row}>
              <Text style={[styles.cell, { width: 150 }]}>{customer.name}</Text>
              <Text style={[styles.cell, { width: 200 }]}>
                {customer.address}
              </Text>
              <Text style={[styles.cell, { width: 100 }]}>
                {customer.spent ?? 0}
              </Text>
              <Text style={[styles.cell, { width: 160 }]}>
                {customer.customerSince
                  ? moment(customer.customerSince).format("MMM D, YYYY")
                  : "-"}
              </Text>
              <Text style={[styles.cell, { width: 160 }]}>
                {customer.lastPurchase
                  ? moment(customer.lastPurchase).format("MMM D, YYYY")
                  : "-"}
              </Text>
            </View>
          ))}
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
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerRow: {
    backgroundColor: "#f3f4f6",
  },
  cell: {
    paddingHorizontal: 8,
    fontSize: 13,
  },
  headerCell: {
    fontWeight: "bold",
  },
});

export default CustomersTable;
