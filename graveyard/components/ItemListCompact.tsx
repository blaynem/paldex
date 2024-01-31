// ProfileList.js
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getItems } from "@/utils/utils";
import ItemBar, { ItemBarProps } from "./ItemBar";
import { Item_Type } from "@/types/types";
import { Text, getCurrentThemeStyles } from "./Themed";
import { AntDesign } from "@expo/vector-icons";

const ItemList = () => {
  const themeStyles = getCurrentThemeStyles();
  const [search, setSearch] = useState("");

  const permData: Item_Type[] = getItems();

  const [itemData, setPalsData] = useState(permData);
  const renderItem = (item: ItemBarProps) => <ItemBar item={item.item} />;

  useEffect(() => {
    setPalsData(
      permData
        .filter((item) => {
          return (
            item.item_name.toLowerCase().match(search.toLowerCase()) ||
            item.droppers.some((dropper) =>
              dropper.name.toLowerCase().match(search.toLowerCase())
            )
          );
        })
        .sort((a, b) => {
          return a.item_name.localeCompare(b.item_name);
        })
    );
  }, [search]);
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <View
        style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
      >
        <TextInput
          style={{
            ...styles.input,
            borderColor: themeStyles.text,
            backgroundColor: "white",
            color: "black",
          }}
          onChangeText={setSearch}
          value={search}
          placeholder={"Search"}
          placeholderTextColor={"#777"}
        ></TextInput>
        <TouchableOpacity style={styles.button} onPress={() => setSearch("")}>
          <AntDesign name="closecircleo" size={12} color={"black"} />
        </TouchableOpacity>
      </View>
      <Text style={{textAlign: "center", color: themeStyles.text}}>Click an item to open details!</Text>
      <FlatList
        style={styles.container}
        data={itemData}
        renderItem={renderItem}
        keyExtractor={(item) => item.item_name}
      />
    </View>
  );
};

export default ItemList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 70,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    flex: 1,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 50,
  },
  button: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
