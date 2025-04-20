import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Image } from "react-native";
import {
  TextInput,
  Button,
  Text,
  RadioButton,
  Switch,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { urls } from "@/constants/urls";
import { useRouter } from "expo-router";

export default function NewProductScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    discountPrice: "",
    inStock: "",
    storage: "",
    color: "",
    network: "",
    simType: "",
    condition: "new",
    isFeatured: false,
    isNewArrival: false,
    image: null as string | null,
  });

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission denied", "Camera roll access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setForm((prev) => ({
        ...prev,
        image: result.assets[0].uri,
      }));
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.inStock) {
      Alert.alert("Missing required fields");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "image" && value) {
          data.append("image", {
            uri: value as string,
            name: "product.jpg",
            type: "image/jpeg",
          } as any);
        } else {
          data.append(key, value as string);
        }
      });

      await axios.post(`${urls.backendUrl}/products`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Product created successfully!");
      router.push("/inventory");
    } catch (error) {
      Alert.alert("Error", "Something went wrong while saving the product.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Add New Product
      </Text>

      <TextInput
        label="Name"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
        mode="outlined"
      />
      <TextInput
        label="Brand"
        value={form.brand}
        onChangeText={(text) => handleChange("brand", text)}
        mode="outlined"
      />
      <TextInput
        label="Category"
        value={form.category}
        onChangeText={(text) => handleChange("category", text)}
        mode="outlined"
      />
      <TextInput
        label="Description"
        value={form.description}
        onChangeText={(text) => handleChange("description", text)}
        multiline
        numberOfLines={3}
        mode="outlined"
      />

      <TextInput
        label="Price"
        value={form.price}
        onChangeText={(text) => handleChange("price", text)}
        keyboardType="decimal-pad"
        mode="outlined"
        left={<TextInput.Affix text="$" />}
      />
      <TextInput
        label="Discount Price"
        value={form.discountPrice}
        onChangeText={(text) => handleChange("discountPrice", text)}
        keyboardType="decimal-pad"
        mode="outlined"
        left={<TextInput.Affix text="$" />}
      />
      <TextInput
        label="Stock"
        value={form.inStock}
        onChangeText={(text) => handleChange("inStock", text)}
        keyboardType="numeric"
        mode="outlined"
      />

      <TextInput
        label="Storage"
        value={form.storage}
        onChangeText={(text) => handleChange("storage", text)}
        mode="outlined"
      />
      <TextInput
        label="Color"
        value={form.color}
        onChangeText={(text) => handleChange("color", text)}
        mode="outlined"
      />
      <TextInput
        label="Network"
        value={form.network}
        onChangeText={(text) => handleChange("network", text)}
        mode="outlined"
      />
      <TextInput
        label="SIM Type"
        value={form.simType}
        onChangeText={(text) => handleChange("simType", text)}
        mode="outlined"
      />

      <Text style={styles.label}>Condition</Text>
      <RadioButton.Group
        onValueChange={(value) => handleChange("condition", value)}
        value={form.condition}
      >
        <View style={styles.radioGroup}>
          <RadioButton.Item label="Brand New" value="new" />
          <RadioButton.Item label="Refurbished" value="refurbished" />
        </View>
      </RadioButton.Group>

      <View style={styles.switchRow}>
        <Text>New Arrival</Text>
        <Switch
          value={form.isNewArrival}
          onValueChange={(val) => handleChange("isNewArrival", val)}
        />
      </View>

      <View style={styles.switchRow}>
        <Text>Featured</Text>
        <Switch
          value={form.isFeatured}
          onValueChange={(val) => handleChange("isFeatured", val)}
        />
      </View>

      <Button mode="outlined" icon="image" onPress={pickImage}>
        {form.image ? "Change Image" : "Upload Image"}
      </Button>

      {form.image && (
        <Image
          source={{ uri: form.image }}
          style={{ width: "100%", height: 200, marginTop: 10 }}
          resizeMode="cover"
        />
      )}

      <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 24 }}>
        Save Product
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    marginVertical: 40,
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  label: {
    marginTop: 16,
    marginBottom: 4,
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
});
