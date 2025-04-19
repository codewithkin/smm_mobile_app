import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
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
  const [filter, setFilter] = useState("");

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
    if (filter === "new") {
      updated = updated.filter((p) => p.isNewArrival);
    } else if (filter === "most") {
      updated = updated.sort(
        (a, b) => (b.purchases?.length || 0) - (a.purchases?.length || 0),
      );
    } else if (filter === "price") {
      updated = updated.sort((a, b) => a.price - b.price);
    }
    if (searchQuery) {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setFiltered(updated);
  }, [filter, searchQuery]);

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
          <Card style={styles.card}>
            <Card.Title title={item.name} subtitle={item.brand} />
            <Card.Content>
              <Text>In Stock: {item.inStock}</Text>
              <Text>Price: ${item.price}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => console.log("Edit", item.id)}>Edit</Button>
              <Button onPress={() => deleteItem(item.id)} textColor="red">
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

        <View style={styles.filters}>
          <Chip
            selected={filter === "new"}
            onPress={() => setFilter("new")}
            style={styles.chip}
          >
            New
          </Chip>
          <Chip
            selected={filter === "most"}
            onPress={() => setFilter("most")}
            style={styles.chip}
          >
            Most Bought
          </Chip>
          <Chip
            selected={filter === "price"}
            onPress={() => setFilter("price")}
            style={styles.chip}
          >
            Price
          </Chip>
          <Chip
            selected={filter === ""}
            onPress={() => setFilter("")}
            style={styles.chip}
          >
            All
          </Chip>
        </View>

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
    marginBottom: 12,
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
  filters: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
  chip: {
    marginRight: 8,
  },
});
