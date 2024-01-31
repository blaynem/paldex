import { Pals_Basic_Type } from "@/types/types";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import ElementBadge from "./ElementBadge";

const ElementsContainer = ({
  id,
  elements,
}: {
  id: string;
  elements: string[];
}) => {
  return (
    <View style={styles.elementsContainer}>
      {elements.map((element) => {
        return (
          <ElementBadge key={id + element} element={element}></ElementBadge>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  elementsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});

export default ElementsContainer;
