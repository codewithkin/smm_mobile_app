import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Card, Title, Paragraph, DataTable, FAB } from "react-native-paper";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { urls } from "@/constants/urls";
import { Button } from "react-native-paper";
import { router } from "expo-router";

export default function ReceiptsPage() {
  const [receiptData, setReceiptData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    manual: 0,
    web: 0,
    device: 0,
    accessories: 0,
  });

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await axios.get(`${urls.backendUrl}/checkout`);
        const allReceipts = res.data.receipts;

        setReceiptData(allReceipts);
        setFiltered(allReceipts);

        // Categorize receipts
        const manual = allReceipts.filter((r) => r.source === "manual").length;
        const web = allReceipts.filter((r) => r.source === "web").length;
        const device = allReceipts.filter((r) => r.source === "device").length;
        const accessories = allReceipts.filter((r) =>
          r.items.some((item: any) =>
            item.name?.toLowerCase().includes("accessory"),
          ),
        ).length;

        setStats({ manual, web, device, accessories });
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
      console.log("Receipt download url: ", url);

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  console.log("RECEIPTS: ", filtered);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = receiptData.filter((r) =>
      r.id.toLowerCase().includes(text.toLowerCase()),
    );
    setFiltered(filteredData);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>
          <FontAwesome5 name="file-invoice-dollar" size={20} color="#007acc" />{" "}
          Receipts
        </Text>
        <Text style={styles.subheading}>Manage and download your receipts</Text>

        {/* 🔍 Search Input */}
        <TextInput
          placeholder="Search by receipt ID..."
          style={styles.searchInput}
          value={search}
          onChangeText={handleSearch}
        />

        {/* 📊 Summary Cards */}
        <Text style={styles.sectionTitle}>Receipt Sources</Text>
        <View style={styles.cardsContainer}>
          <StatCard
            title="Manual"
            icon={<FontAwesome5 name="plus" size={22} color="#007acc" />}
            subtitle={`${stats.manual} receipts`}
            bgColor="#e6f7ff"
          />
          <StatCard
            title="From Website"
            icon={
              <MaterialCommunityIcons name="web" size={24} color="#722ed1" />
            }
            subtitle={`${stats.web} receipts`}
            bgColor="#f9f0ff"
          />
          <StatCard
            title="Device"
            icon={
              <MaterialCommunityIcons
                name="cellphone"
                size={24}
                color="#faad14"
              />
            }
            subtitle={`${stats.device} receipts`}
            bgColor="#fffbe6"
          />
          <StatCard
            title="Accessories"
            icon={
              <MaterialCommunityIcons
                name="headphones"
                size={24}
                color="#f5222d"
              />
            }
            subtitle={`${stats.accessories} receipts`}
            bgColor="#fff1f0"
          />
        </View>

        {/* 📋 Receipts Table */}
        <Text style={styles.sectionTitle}>All Receipts</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title>ID</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title numeric>Total</DataTable.Title>
              <DataTable.Title>Download</DataTable.Title>
            </DataTable.Header>

            {filtered.map((receipt) => (
              <DataTable.Row key={receipt.id}>
                <DataTable.Cell>{receipt.id.slice(0, 6)}</DataTable.Cell>
                <DataTable.Cell>
                  {new Date(receipt.createdAt).toLocaleDateString()}
                </DataTable.Cell>
                <DataTable.Cell numeric>${receipt.total}</DataTable.Cell>
                <DataTable.Cell>
                  <Button
                    onPress={() => {
                      handleDownload(receipt.downloadUrl);
                    }}
                  >
                    <FontAwesome5 name="download" size={18} color="#1890ff" />
                  </Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>

        {/* ❌ No Results Message */}
        {filtered.length === 0 && (
          <Text style={styles.noResults}>No receipt matches this ID.</Text>
        )}

        {/* 🧾 Receipt Cards */}
        <Text style={styles.sectionTitle}>Receipt Cards</Text>
        <View style={styles.receiptCardContainer}>
          {filtered.map((receipt, index) => (
            <Card style={styles.receiptCard} key={index}>
              <Card.Content>
                <Title>#{receipt.id.slice(0, 6)}</Title>
                <Paragraph>
                  Date: {new Date(receipt.createdAt).toLocaleDateString()}
                </Paragraph>
                <Paragraph>Total: ${receipt.total}</Paragraph>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Receipt url: ", receipt.downloadUrl);
                    handleDownload(`${urls.backendUrl}/${receipt.downloadUrl}`);
                  }}
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

      {/* ➕ Floating Action Button */}
      <FAB
        style={styles.fab}
        small
        icon="plus"
        label="Add Receipt"
        onPress={() => {
          router.push("/receipts/new");
        }}
      />
    </View>
  );
}

function StatCard({ title, icon, subtitle, bgColor }: any) {
  return (
    <Card style={[styles.card, { backgroundColor: bgColor }]}>
      <Card.Content style={styles.cardContent}>
        {icon}
        <View style={styles.cardText}>
          <Title>{title}</Title>
          <Paragraph>{subtitle}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 80,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 30,
    color: "#1e1e1e",
  },
  subheading: {
    fontSize: 14,
    fontWeight: "400",
    color: "gray",
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  cardsContainer: {
    gap: 10,
    marginBottom: 30,
  },
  card: {
    width: "100%",
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    marginLeft: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
    color: "#333",
  },
  table: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    minWidth: 600,
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
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginVertical: 20,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#007acc",
  },
});
