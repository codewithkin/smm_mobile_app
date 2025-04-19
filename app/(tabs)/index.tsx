import TopBar from "../../components/TopBar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";

export default function Dashboard() {
  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.primary,
        height: "100%",
      }}
    >
      <View style={styles.container}>
        <TopBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
});
