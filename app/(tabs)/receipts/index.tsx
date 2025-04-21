import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  DataTable,
  FAB,
  Button as PaperButton,
} from "react-native-paper";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { urls } from "@/constants/urls";
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
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

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

        <TextInput
          placeholder="Search by receipt ID..."
          style={styles.searchInput}
          value={search}
          onChangeText={handleSearch}
        />

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
                  <PaperButton
                    onPress={() => handleDownload(receipt.downloadUrl)}
                  >
                    <FontAwesome5 name="download" size={18} color="#1890ff" />
                  </PaperButton>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>

        {filtered.length === 0 && (
          <Text style={styles.noResults}>No receipt matches this ID.</Text>
        )}

        <Text style={styles.sectionTitle}>Receipt Cards</Text>
        <View style={styles.receiptCardContainer}>
          {filtered.map((receipt) => (
            <Card style={styles.receiptCard} key={receipt.id}>
              <Card.Content>
                <Text style={styles.shopName}>Smart Switch Mobile</Text>
                <Text style={styles.receiptId}>
                  Receipt number:{" "}
                  <Text style={styles.receiptIdMuted}>{receipt.id}</Text>
                </Text>

                <Text style={styles.receiptDate}>
                  Date:{" "}
                  {new Date(receipt.createdAt).toLocaleDateString("en-ZW", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>

                <View style={{ marginTop: 12 }}>
                  <Text style={styles.itemsHeader}>Items:</Text>
                  {receipt.items.map((item: any) => (
                    <Text style={styles.item} key={item.id}>
                      • {item.name} (x{item.quantity}) - $
                      {(item.price * item.quantity).toFixed(2)}
                    </Text>
                  ))}
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>${receipt.total}</Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    handleDownload(`${urls.backendUrl}/${receipt.downloadUrl}`)
                  }
                >
                  <View style={styles.downloadBtn}>
                    <FontAwesome5 name="download" size={16} color="white" />
                    <Text style={styles.downloadText}>Download Receipt</Text>
                  </View>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                  Shop #18 2nd Floor Meikles Market, Mutare, Zimbabwe
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        small
        icon="plus"
        label="Add Receipt"
        onPress={() => router.push("/receipts/new")}
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
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginVertical: 20,
  },
  receiptCardContainer: {
    gap: 16,
    marginBottom: 50,
  },
  receiptCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  shopName: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    color: "#111",
  },
  receiptId: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  receiptIdMuted: {
    color: "#888",
    fontSize: 13,
  },
  receiptDate: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  itemsHeader: {
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 14,
  },
  item: {
    fontSize: 13,
    color: "#444",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007acc",
  },
  downloadBtn: {
    marginTop: 10,
    backgroundColor: "#007acc",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  downloadText: {
    color: "white",
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 16,
    color: "#888",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#007acc",
  },
});