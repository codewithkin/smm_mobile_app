import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import ChartContainer from "../shared/ChartContainer";
import { colors } from "@/constants/colors";
import { useEffect, useState } from "react";

export default function SalesLineChart({ sales }: { sales: any }) {
  const [data, setData] = useState<null | any>(null);

  useEffect(() => {
    const generateData = () => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthlyCount = new Array(12).fill(0); // index = month

      for (let sale of sales) {
        const date = new Date(sale.createdAt);
        const monthIndex = date.getMonth();
        monthlyCount[monthIndex] += 1;
      }

      const chartData = monthlyCount.map((count, index) => ({
        label: months[index],
        value: count,
      }));

      setData(chartData);
    };

    if (sales.length > 0) {
      generateData();
    }
  }, [sales]);

  return (
    <ChartContainer>
      <Text
        style={{
          color: colors.purple,
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 8,
        }}
      >
        Sales by month
      </Text>

      {data && sales.length > 0 ? (
        <LineChart
          data={data}
          spacing={30}
          thickness={2}
          color={colors.secondary}
          hideDataPoints={false}
          dataPointsColor={colors.secondary}
          xAxisLabelTextStyle={{ fontSize: 10 }}
          yAxisColor="gray"
          xAxisColor="gray"
          startFillColor="transparent"
          endFillColor="transparent"
        />
      ) : (
        <View
          style={{
            backgroundColor: "lightgray",
            borderRadius: 24,
            padding: 8,
          }}
        >
          <Text
            style={{
              color: "gray",
              fontSize: 12,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            No sales yet...
          </Text>
        </View>
      )}
    </ChartContainer>
  );
}

const styles = StyleSheet.create({});
