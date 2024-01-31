// ProfileList.js
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PalBar from "./PalBar";
import { getPals } from "@/utils/utils";
import { AntDesign } from "@expo/vector-icons";
import { Text, getCurrentThemeStyles } from "./Themed";
import { Pals_Type } from "@/types/types";

const permData: Pals_Type[] = getPals()
  .filter((pal) => pal.pal_index != "-1" && pal.pal_index != "-2")
  .sort((a, b) => parseInt(a.pal_index) - parseInt(b.pal_index));

const PalList = () => {
  const themeStyles = getCurrentThemeStyles();
  const [search, setSearch] = useState("");

  const [palsData, setPalsData] = useState(permData);

  useEffect(() => {
    setPalsData(
      permData.filter((pal) => {
        let elementMatch = false;

        for (let i = 0; i < pal.pal_type.length; i++) {
          if (pal.pal_type[i].toLowerCase().match(search.toLowerCase())) {
            elementMatch = true;
            break;
          }
        }

        return (
          pal.pal_name.toLowerCase().match(search.toLowerCase()) ||
          elementMatch ||
          parseInt(pal.pal_index) == parseInt(search)
        );
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
          style={{ ...styles.input, borderColor: themeStyles.text }}
          // clearButtonMode="always"
          onChangeText={setSearch}
          value={search}
          placeholder={"Search"}
          placeholderTextColor={"#777"}
          numberOfLines={1}
        ></TextInput>
        <TouchableOpacity style={styles.button} onPress={() => setSearch("")}>
          <AntDesign name="closecircleo" size={12} color={"black"} />
        </TouchableOpacity>
      </View>
      <Text style={{ textAlign: "center", color: themeStyles.text }}>
        Click a Pal to open details!
      </Text>

      <FlatList
        style={styles.container}
        data={palsData}
        renderItem={({ item }) => <PalBar pal={item} />}
        keyExtractor={(pal) => pal.pal_dev_name}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

export default PalList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 60,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 50, // Make room for the button
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 10,
    color: "black",
    width: "80%",
    flex: 1,
  },
  button: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
