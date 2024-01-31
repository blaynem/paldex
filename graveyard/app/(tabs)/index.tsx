import { StyleSheet } from "react-native";
import { View, getCurrentThemeStyles } from "@/components/Themed";
import PalList from "@/components/PalList";

export default function PalsListScreen() {
  const themeStyles = getCurrentThemeStyles();
  return (
    <View style={{...styles.container, backgroundColor: themeStyles.background}}>
      <PalList />
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
