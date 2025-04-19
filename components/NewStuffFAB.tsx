import React, { useState } from "react";
import { FAB } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

interface NewStuffFABProps {
  show: boolean;
}

const NewStuffFAB: React.FC<NewStuffFABProps> = ({ show }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  return (
    <FAB.Group
      visible={show}
      open={open}
      icon={open ? "close" : "plus"}
      actions={[
        {
          icon: "plus-box",
          label: "Add Product",
          onPress: () => {
            router.push("/products/new");
          },
        },
        {
          icon: "receipt",
          label: "Generate Receipt",
          onPress: () => {
            router.push("/receipt/new");
          },
        },
        {
          icon: "account-plus",
          label: "Add User",
          onPress: () => {
            router.push("/user/new");
          },
        },
      ]}
      onStateChange={({ open }) => setOpen(open)}
      style={styles.fab}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default NewStuffFAB;
