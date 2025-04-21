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
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";

interface Item {
  name: string;
  price: string;
  quantity: string;
}

interface ReceiptMetadata {
  id: string;
  createdAt: string;
  total: number;
  items: Item[];
}

const AddReceiptScreen: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { name: "", price: "", quantity: "" },
  ]);
  const [total, setTotal] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<ReceiptMetadata | null>(null);

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

      const response = await fetch(`${urls.backendUrl}/checkout/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit receipt");

      const data = await response.json();

      setSuccess(true);
      setReceipt({
        id: data.id,
        createdAt: data.createdAt,
        total,
        items,
      });

      setItems([{ name: "", price: "", quantity: "" }]);
      setTotal(0);

      Toast.success("Receipt created successfully");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const downloadAndShare = async () => {
    try {
      if (!receipt) return;
      const fileUri =
        FileSystem.documentDirectory + `receipt_${receipt.id}.pdf`;
      const downloadResumable = FileSystem.createDownloadResumable(
        `${urls.backendUrl}/checkout/download/${receipt.id}`,
        fileUri,
      );

      const { uri } = await downloadResumable.downloadAsync();
      await Sharing.shareAsync(uri);
    } catch (e) {
      console.error("Download/Share failed:", e);
    }
  };

  const printReceipt = async () => {
    try {
      if (!receipt) return;
      const pdfUri = `${urls.backendUrl}/checkout/download/${receipt.id}`;
      const { uri } = await FileSystem.downloadAsync(
        pdfUri,
        FileSystem.documentDirectory + `temp_receipt.pdf`,
      );
      await Print.printAsync({ uri });
    } catch (err) {
      console.error("Print error:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {!success ? (
          <>
            <Text style={styles.header}>Create New Receipt</Text>

            {items.map((item, index) => (
              <Card key={index} style={styles.card}>
                <Card.Title title={`Item ${index + 1}`} />
                <Card.Content>
                  <TextInput
                    label="Name"
                    value={item.name}
                    onChangeText={(text) =>
                      handleItemChange(index, "name", text)
                    }
                    style={styles.input}
                  />
                  <TextInput
                    label="Price"
                    value={item.price}
                    keyboardType="decimal-pad"
                    onChangeText={(text) =>
                      handleItemChange(index, "price", text)
                    }
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
          </>
        ) : (
          <>
            <Card style={styles.successCard}>
              <Card.Title title="🎉 Receipt Created!" />
              <Card.Content>
                <Text>✅ Receipt ID: {receipt?.id}</Text>
                <Text>📅 Date: {new Date(receipt?.createdAt!).toDateString()}</Text>
                <Text>🧾 Total: ${receipt?.total.toFixed(2)}</Text>
                <Text style={{ marginTop: 10, fontWeight: "bold" }}>
                  Items:
                </Text>
                {receipt?.items.map((item, index) => (
                  <Text key={index}>
                    - {item.name} | ${item.price} x {item.quantity}
                  </Text>
                ))}
              </Card.Content>
              <Card.Actions style={{ flexDirection: "column", gap: 8 }}>
                <Button icon="download" mode="outlined" onPress={downloadAndShare}>
                  Download / Share PDF
                </Button>
                <Button icon="printer" mode="outlined" onPress={printReceipt}>
                  Print Receipt
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {
                    setSuccess(false);
                    setReceipt(null);
                  }}
                  style={{ marginTop: 10 }}
                >
                  Create Another
                </Button>
              </Card.Actions>
            </Card>
          </>
        )}

        <Snackbar
          visible={success}
          onDismiss={() => {}}
          duration={2000}
        >
          Receipt submitted successfully!
        </Snackbar>
      </ScrollView>
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
  successCard: {
    marginTop: 16,
    paddingBottom: 20,
  },
});

export default AddReceiptScreen;