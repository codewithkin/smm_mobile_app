import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  Text,
  SegmentedButtons,
  Card,
  Button,
  Menu,
  IconButton,
  DataTable,
  Searchbar,
  Chip,
  Badge,
} from "react-native-paper";
import axios from "axios";
import { urls } from "@/constants/urls";

interface Product {
  id: string;
  name: string;
  brand: string;
  category?: string;
  description: string;
  price: number;
  discountPrice?: number;
  inStock: number;
  images: string[];
  storage: string;
  color: string;
  network: string;
  simType: string;
  condition: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
  updatedAt: string;
  purchases: any[];
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${urls.backendUrl}/products/`);
      setProducts(response.data.products);
      setFiltered(response.data.products);
    } catch (error) {
      Alert.alert("Error", "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let updated = [...products];
    if (searchQuery) {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFiltered(updated);
  }, [searchQuery]);

  const deleteItem = (id: string) => {
    Alert.alert("Confirm", "Delete this product?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(`${urls.backendUrl}/products/${id}`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
          } catch {
            Alert.alert("Error", "Failed to delete product");
          }
        },
      },
    ]);
  };

  const renderCardView = () => {
    if (loading) {
      return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
    }

    return (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card mode="outlined" style={styles.card}>
            {item.images?.[0] && (
              <Card.Cover
                source={{ uri: item.images[0] }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            )}

            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.productName}>{item.name}</Text>
                <View style={styles.badgeContainer}>
                  {item.isNewArrival && (
                    <Badge style={styles.newBadge}>NEW</Badge>
                  )}
                  {item.isFeatured && (
                    <Badge style={styles.featuredBadge}>FEATURED</Badge>
                  )}
                </View>
              </View>

              <Text style={styles.brandText}>{item.brand}</Text>
              <Text style={styles.conditionText}>
                {item.condition === "refurbished"
                  ? "Refurbished"
                  : "Brand New"}
              </Text>

              <View style={styles.priceStockRow}>
                <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
                <Text style={styles.stockText}>{item.inStock} in stock</Text>
              </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
              <Button mode="outlined" onPress={() => console.log("Edit", item.id)}>
                Edit
              </Button>
              <Button
                mode="outlined"
                onPress={() => deleteItem(item.id)}
                textColor="red"
                style={{ borderColor: "red" }}
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    );
  };

  const renderTableView = () => {
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title numeric>Price</DataTable.Title>
          <DataTable.Title numeric>Stock</DataTable.Title>
          <DataTable.Title>Action</DataTable.Title>
        </DataTable.Header>

        {filtered.map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell numeric>${item.price}</DataTable.Cell>
            <DataTable.Cell numeric>{item.inStock}</DataTable.Cell>
            <DataTable.Cell>
              <IconButton
                icon="pencil"
                size={16}
                onPress={() => console.log("Edit", item.id)}
              />
              <IconButton
                icon="delete"
                size={16}
                onPress={() => deleteItem(item.id)}
              />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    );
  };

  const renderListView = () => {
    return (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
            <Text>{item.inStock} in stock</Text>
            <View style={styles.actions}>
              <Button onPress={() => console.log("Edit", item.id)}>Edit</Button>
              <Button onPress={() => deleteItem(item.id)} textColor="red">
                Delete
              </Button>
            </View>
          </View>
        )}
      />
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search product..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ marginBottom: 12 }}
        />

        <SegmentedButtons
          value={view}
          onValueChange={setView}
          buttons={[
            { value: "card", label: "Card" },
            { value: "table", label: "Table" },
            { value: "list", label: "List" },
          ]}
        />

        <View style={styles.content}>
          {view === "card" && renderCardView()}
          {view === "table" && renderTableView()}
          {view === "list" && renderListView()}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  content: {
    marginTop: 16,
  },
  list: {
    gap: 12,
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardImage: {
    height: 160,
  },
  cardContent: {
    paddingTop: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  brandText: {
    fontSize: 14,
    color: "#6e6e6e",
    marginTop: 4,
  },
  conditionText: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
    fontStyle: "italic",
  },
  priceStockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
  },
  stockText: {
    fontSize: 14,
    color: "#999",
  },
  cardActions: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  listItem: {
    padding: 12,
    backgroundColor: "#f8f8f8",
    marginBottom: 8,
    borderRadius: 6,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 6,
  },
  newBadge: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  featuredBadge: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
});