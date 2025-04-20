import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  IconButton,
  SegmentedButtons,
  Card,
  DataTable,
  Searchbar,
  Badge,
  Text,
} from "react-native-paper";
import axios from "axios";
import { urls } from "@/constants/urls";
import { Toast } from "toastify-react-native";
import { EditProductModal } from "@/components/inventory/EditProductModal";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
            Toast.success("Product deleted successfully!");
            fetchProducts(); // Re-fetch the items from DB
          } catch {
            Alert.alert("Error", "Failed to delete product");
          }
        },
      },
    ]);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item,
      ),
    );
    fetchProducts(); // Re-fetch to ensure the product list stays up to date
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
                {item.condition === "refurbished" ? "Refurbished" : "Brand New"}
              </Text>

              <View style={styles.priceStockRow}>
                <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
                <Text style={styles.stockText}>{item.inStock} in stock</Text>
              </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => handleEdit(item)}
              />
              <IconButton
                icon="trash-can"
                size={20}
                onPress={() => deleteItem(item.id)}
              />
            </Card.Actions>
          </Card>
        )}
      />
    );
  };

  const renderTableView = () => {
    if (loading) {
      return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
    }

    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Price</DataTable.Title>
          <DataTable.Title>Stock</DataTable.Title>
          <DataTable.Title>Action</DataTable.Title>
        </DataTable.Header>

        {filtered.map((product) => (
          <DataTable.Row key={product.id}>
            <DataTable.Cell>{product.name}</DataTable.Cell>
            <DataTable.Cell>${product.price.toFixed(2)}</DataTable.Cell>
            <DataTable.Cell>{product.inStock}</DataTable.Cell>
            <DataTable.Cell style={styles.tableActions}>
              <View style={styles.tableButtons}>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => handleEdit(product)}
                  style={styles.tableButton}
                />
                <IconButton
                  icon="trash-can"
                  size={20}
                  onPress={() => deleteItem(product.id)}
                  style={styles.tableButton}
                />
              </View>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    );
  };

  const renderListView = () => {
    if (loading) {
      return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
    }

    return (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name}</Text>
            <Text>${item.price.toFixed(2)}</Text>
            <Text>{item.inStock} in stock</Text>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => handleEdit(item)}
              style={{ marginTop: 8 }}
            />
            <IconButton
              icon="trash-can"
              size={20}
              onPress={() => deleteItem(item.id)}
              style={{ marginTop: 8 }}
            />
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

        {/* Edit Product Modal */}
        <EditProductModal
          visible={modalVisible}
          product={selectedProduct}
          onClose={() => setModalVisible(false)}
          onProductUpdated={handleProductUpdated}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 56,
    padding: 16,
  },
  content: {
    marginTop: 16,
  },
  list: {
    gap: 12,
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
    alignItems: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  badgeContainer: {
    flexDirection: "row",
  },
  newBadge: {
    marginRight: 8,
  },
  featuredBadge: {
    marginRight: 8,
  },
  brandText: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  conditionText: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  priceStockRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stockText: {
    fontSize: 14,
    color: "#888",
  },
  cardActions: {
    paddingTop: 8,
    justifyContent: "space-between",
  },
  tableActions: {
    alignItems: "flex-end",
  },
  tableButtons: {
    flexDirection: "row",
    gap: 8,
  },
  tableButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
