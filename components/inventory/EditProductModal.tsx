import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { TextInput, Button, Text, IconButton, Card } from "react-native-paper";
import axios from "axios";
import { urls } from "@/constants/urls";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category?: string; // Optional category field
  description: string;
  price: number;
  discountPrice?: number; // Optional discounted price
  inStock: number;
  images: string[]; // List of image URLs
  storage: string;
  color: string;
  network: string;
  simType: string;
  condition: "new" | "refurbished"; // Possible values: 'new' or 'refurbished'
  isFeatured?: boolean; // Optional field indicating if the product is featured
  isNewArrival?: boolean; // Optional field indicating if it's a new arrival
  createdAt: string; // Date when the product was created
  updatedAt: string; // Date when the product was last updated
  purchases: any[]; // This could be a list of purchase transactions associated with the product
}

interface EditProductModalProps {
  visible: boolean;
  product: any | null;
  onClose: () => void;
  onProductUpdated: (updatedProduct: Product) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  product,
  onClose,
  onProductUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (product) {
      setEditedProduct({ ...product });
    }
  }, [product]);

  const handleInputChange = (field: keyof Product, value: string) => {
    if (editedProduct) {
      setEditedProduct({ ...editedProduct, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!editedProduct) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `${urls.backendUrl}/products/${editedProduct.id}`,
        editedProduct,
      );
      onProductUpdated(response.data);
      onClose(); // Close the modal after saving
    } catch (error) {
      Alert.alert("Error", "Failed to update the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <View style={styles.modalContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.modalTitle}>Edit Product</Text>
            {editedProduct ? (
              <>
                <TextInput
                  label="Product Name"
                  style={styles.input}
                  value={editedProduct.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                />
                <TextInput
                  label="Brand"
                  style={styles.input}
                  value={editedProduct.brand}
                  onChangeText={(text) => handleInputChange("brand", text)}
                />
                <TextInput
                  label="Price"
                  style={styles.input}
                  value={editedProduct.price.toString()}
                  onChangeText={(text) =>
                    handleInputChange("price", parseFloat(text).toString())
                  }
                  keyboardType="numeric"
                />
                <TextInput
                  label="Description"
                  style={styles.input}
                  value={editedProduct.description}
                  onChangeText={(text) =>
                    handleInputChange("description", text)
                  }
                  multiline
                  numberOfLines={4}
                />

                {/* Add more fields here if necessary */}
              </>
            ) : (
              <ActivityIndicator size="large" style={styles.loading} />
            )}

            <Button
              mode="contained"
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
            >
              Save Changes
            </Button>
          </Card.Content>
        </Card>
        <IconButton
          icon="close"
          size={24}
          onPress={onClose}
          style={styles.closeButton}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  loading: {
    marginTop: 20,
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
});
