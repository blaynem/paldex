import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Pals_Type } from "@/types/types";
import { AntDesign } from "@expo/vector-icons";
import { getCurrentThemeStyles } from "./Themed";

interface DropdownProps {
  data: { pal: Pals_Type }[];
  selectedItem: Pals_Type;
  setSelectedItem: (item: Pals_Type) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  data,
  selectedItem,
  setSelectedItem,
}) => {
  const themeStyles = getCurrentThemeStyles();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (text: string) => {
    setSearchText(text.trim());
    const filtered = data.filter((item) =>
      item.pal.pal_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
    setIsDropdownOpen(true);
  };

  const handleSelect = (item: Pals_Type) => {
    setSearchText(item.pal_name);
    setSelectedItem(item);
    setIsDropdownOpen(false);
  };

  const onClearPress = () => {
    setSearchText("");
    setIsDropdownOpen(false);
    setSelectedItem({} as Pals_Type);
  }

  const renderItem = ({ item }: { item: { pal: Pals_Type } }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelect(item.pal)}
    >
      <Text>{item.pal.pal_name}</Text>
    </TouchableOpacity>
  );

  const handleSubmitEditing = () => {
    const filtered = data.filter((item) =>
      item.pal.pal_name.toLowerCase().includes(searchText.trim().toLowerCase())
    );
    if (filtered.length === 1) {
      setSelectedItem(filtered[0].pal);
      setSearchText("");
      setIsDropdownOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
      >
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch}
          onFocus={() => setIsDropdownOpen(true)}
          onSubmitEditing={handleSubmitEditing}
        />
        <TouchableOpacity style={styles.button} onPress={onClearPress}>
          <AntDesign name="closecircleo" size={12} color={"black"} />
        </TouchableOpacity>
      </View>
      {isDropdownOpen && (
        <View style={styles.listContainer}>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.pal.pal_index.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No items found</Text>
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    flex:1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  listContainer: {
    maxHeight: 200, // Limit the height of dropdown
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 5,
    backgroundColor: "white",
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  emptyText: {
    textAlign: "center",
    padding: 10,
    fontStyle: "italic",
  },
  button: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});

export default Dropdown;
