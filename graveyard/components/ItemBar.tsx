import { Item_Type } from "@/types/types";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { getItemIconSource } from "@/utils/utils";
import { getCurrentThemeStyles } from "./Themed";
import { TransformedItemDetails } from "@/data-provider/transformers/types";

export type ItemBarProps = {
  item: TransformedItemDetails;
};

const ItemBar = ({ item }: ItemBarProps) => {
  const imageSrc = getItemIconSource(item.item_dev_name);
  const themeStyles = getCurrentThemeStyles();
  return (
    <TouchableOpacity
      onPress={() => {
        router.navigate({
          pathname: `/ItemPage/[id]`,
          params: { id: item.item_dev_name },
        });
      }}
    >
      <View style={{...styles.container, backgroundColor: themeStyles.background}}>
        <View style={styles.leftColumn}>
          <Text
            style={{
              color: themeStyles.text,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {item.item_name}
          </Text>
        </View>
        <Image source={imageSrc} style={styles.rightColumn} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  leftColumn: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  rightColumn: {
    alignItems: "flex-end",
    width: 50,
    height: 50,
    aspectRatio: 1,
    borderRadius: 5,
  },
});

export default React.memo(ItemBar);
