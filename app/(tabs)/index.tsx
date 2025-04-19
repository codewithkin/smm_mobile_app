import TopBar from "../../components/TopBar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";
import { MotiView } from "moti";

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

        {/* Home content with animation */}
        <MotiView
          from={{ opacity: 0, translateY: 200 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 1000 }}
          style={styles.content}
        >
          {/* Your animated content goes here */}
        </MotiView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  content: {
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    marginTop: 24,
  },
});
