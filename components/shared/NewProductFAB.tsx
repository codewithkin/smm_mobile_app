import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

export default function NewProductFAB() {
  return (
    <FAB
      icon="plus"
      style={styles.fab}
      onPress={() => {
        router.push("/inventory/new");
      }}
      label="Add Product"
      animated={true}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
