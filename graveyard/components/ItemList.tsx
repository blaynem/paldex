// ProfileList.js
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getItemDroppers, getItems } from "@/utils/utils";
import ItemBar from "./ItemBar";
import { Text, getCurrentThemeStyles } from "./Themed";
import { AntDesign } from "@expo/vector-icons";

// TODO: Dedupe the variants.
// The list is massive. Show beneficial things instead like Armor, Weapons, etc.
const permData = Array.from(getItems().values());

const ItemList = () => {
  const themeStyles = getCurrentThemeStyles();
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(permData);

  useEffect(() => {
    const newFilteredData = permData.filter((item) => {
      const droppers = getItemDroppers(item.item_dev_name);
      return (
        item.item_name.toLowerCase().match(search.toLowerCase()) ||
        droppers.some((dropper) =>
          dropper.name.toLowerCase().match(search.toLowerCase())
        )
      )
    }).sort((a, b) => {
      return a.item_name.localeCompare(b.item_name);
    });

    setFilteredData(newFilteredData);
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
        data={filteredData}
        renderItem={(item) => <ItemBar item={item.item} />}
        keyExtractor={(item) => item.item_dev_name}
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
