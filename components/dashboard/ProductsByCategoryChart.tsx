import React from "react";
import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import ChartContainer from "../shared/ChartContainer";
import { colors } from "@/constants/colors";

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category?: string;
  description: string;
  price: number;
  discountPrice?: number;
  inStock: number;
  images: string[];
  storage: string;
  color: string;
  network: string;
  simType: string;
  condition: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
  updatedAt: string;
  purchases: any[];
}

interface Props {
  products: Product[];
}

const ProductsByCategoryChart: React.FC<Props> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <ChartContainer>
        <View style={{ padding: 16, alignItems: "center" }}>
          <Text>No products available to show category stats.</Text>
        </View>
      </ChartContainer>
    );
  }

  // Group products by category
  const categoryMap: Record<string, number> = {};
  products.forEach((product) => {
    const category = product.category ?? "Uncategorized";
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const barData = Object.entries(categoryMap).map(([category, count]) => ({
    label: category,
    value: count,
    frontColor: "#1d4ed8", // You can change this color
  }));

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
        Products by category
      </Text>
      <BarChart
        barWidth={40}
        noOfSections={4}
        barBorderRadius={6}
        frontColor={colors.turquoise}
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={{ fontSize: 12 }}
        isAnimated
        spacing={30}
        hideRules
        maxValue={Math.max(...barData.map((bar) => bar.value)) + 1}
      />
    </ChartContainer>
  );
};

export default ProductsByCategoryChart;
