import { StyleSheet } from "react-native";
import { View, getCurrentThemeStyles } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { getItemByDevName } from "@/utils/utils";
import ItemPage from "@/components/ItemPage";

export default function ItemProfile() {
  const themeStyles = getCurrentThemeStyles();
  const { id: dev_name } = useLocalSearchParams<{ id: string }>();
  const item = getItemByDevName(dev_name);
  return (
    <View style={{...styles.container, backgroundColor: themeStyles.background}}>
      {item && <ItemPage item={item}></ItemPage>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
