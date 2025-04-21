import { urls } from "@/constants/urls";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Toast } from "toastify-react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  Divider,
  Snackbar,
} from "react-native-paper";

interface Item {
  name: string;
  price: string;
  quantity: string;
}

const AddReceiptScreen: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { name: "", price: "", quantity: "" },
  ]);
  const [total, setTotal] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string,
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
    recalculateTotal(updated);
  };

  const recalculateTotal = (items: Item[]) => {
    const t = items.reduce((sum, i) => {
      const price = parseFloat(i.price);
      const qty = parseInt(i.quantity);
      return sum + (isNaN(price) || isNaN(qty) ? 0 : price * qty);
    }, 0);
    setTotal(t);
  };

  const addItem = () => {
    setItems([...items, { name: "", price: "", quantity: "" }]);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    recalculateTotal(updated);
  };

  const submitReceipt = async () => {
    try {
      setSubmitting(true);

      const payload = {
        total,
        items: items.map((item) => ({
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
        })),
      };

      const response = await fetch(
        `${urls.backendUrl}/checkout/manual`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit receipt");
      }

      setSuccess(true);
      setItems([{ name: "", price: "", quantity: "" }]);

      Toast.succes("Receipt created successfully")
      setTotal(0);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Create New Receipt</Text>

        {items.map((item, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title title={`Item ${index + 1}`} />
            <Card.Content>
              <TextInput
                label="Name"
                value={item.name}
                onChangeText={(text) => handleItemChange(index, "name", text)}
                style={styles.input}
              />
              <TextInput
                label="Price"
                value={item.price}
                keyboardType="decimal-pad"
                onChangeText={(text) => handleItemChange(index, "price", text)}
                style={styles.input}
                left={<TextInput.Icon icon="currency-usd" />}
              />
              <TextInput
                label="Quantity"
                value={item.quantity}
                keyboardType="number-pad"
                onChangeText={(text) =>
                  handleItemChange(index, "quantity", text)
                }
                style={styles.input}
              />
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => removeItem(index)} textColor="red">
                Remove
              </Button>
            </Card.Actions>
          </Card>
        ))}

        <Button
          icon="plus"
          mode="outlined"
          onPress={addItem}
          style={{ marginVertical: 16 }}
        >
          Add Item
        </Button>

        <Divider />
        <View style={styles.totalRow}>
          <Text variant="titleMedium">Total:</Text>
          <Text variant="titleLarge">${total.toFixed(2)}</Text>
        </View>

        <Button
          mode="contained"
          loading={submitting}
          disabled={submitting || total === 0}
          onPress={submitReceipt}
          style={{ marginTop: 20 }}
        >
          Submit Receipt
        </Button>
      </ScrollView>

      <Snackbar
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={3000}
      >
        Receipt submitted successfully!
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    alignItems: "center",
  },
});

export default AddReceiptScreen;
