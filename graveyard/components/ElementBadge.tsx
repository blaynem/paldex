import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ElementBadge = ({ element }: { element: string }) => {
  const getColor = (element: string) => {
    switch (element.toUpperCase()) {
      case "NEUTRAL":
        return "#808080"; // Gray
      case "GRASS":
        return "#008000"; // Green
      case "FIRE":
        return "#FF0000"; // Red
      case "WATER":
        return "#0000FF"; // Blue
      case "ELECTRIC":
        return "#FFD700"; // Gold/Yellow
      case "ICE":
        return "#87CEEB"; // Light Blue
      case "GROUND":
        return "#D2B48C"; // Tan
      case "DARK":
        return "#4B0082"; // Indigo
      case "DRAGON":
        return "#7038F8"; // Purple
      default:
        return "#808080"; // Default to Gray for unknown elements
    }
  };

  const badgeColor = getColor(element);

  return (
    <View style={[styles.container, { backgroundColor: badgeColor }]}>
      <Text style={styles.text}>{element.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 2,
    marginTop: 2,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default ElementBadge;
