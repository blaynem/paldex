import { StyleSheet } from "react-native";
import { View, getCurrentThemeStyles } from "@/components/Themed";
import ItemList from "@/components/ItemList";

export default function PalsListScreen() {
  const themeStyles = getCurrentThemeStyles();
  return (
    <View style={{...styles.container, backgroundColor: themeStyles.background}}>
      <ItemList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
