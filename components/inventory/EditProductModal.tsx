import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
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
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Edit Product</Text>

        {editedProduct ? (
          <>
            <TextInput
              style={{ borderBottomWidth: 1, marginTop: 20 }}
              value={editedProduct.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Product Name"
            />
            <TextInput
              style={{ borderBottomWidth: 1, marginTop: 10 }}
              value={editedProduct.brand}
              onChangeText={(text) => handleInputChange("brand", text)}
              placeholder="Brand"
            />
            <TextInput
              style={{ borderBottomWidth: 1, marginTop: 10 }}
              value={editedProduct.price.toString()}
              onChangeText={(text) =>
                handleInputChange("price", parseFloat(text).toString())
              }
              placeholder="Price"
              keyboardType="numeric"
            />
            <TextInput
              style={{ borderBottomWidth: 1, marginTop: 10 }}
              value={editedProduct.description}
              onChangeText={(text) => handleInputChange("description", text)}
              placeholder="Description"
              multiline
            />
            {/* Add more fields here if necessary */}

            <View style={{ marginTop: 20 }}>
              <Button title="Save Changes" onPress={handleSave} />
              {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
            </View>
          </>
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
    </Modal>
  );
};
