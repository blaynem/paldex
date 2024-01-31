import { StyleSheet } from "react-native";

import { View, getCurrentThemeStyles } from "@/components/Themed";
import PalPage from "../../components/PalPage";
import { useLocalSearchParams } from "expo-router";
import { getPalById } from "@/utils/utils";

export default function PalProfile() {
  const themeStyles = getCurrentThemeStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pal = getPalById(id);
  return (
    <View style={{...styles.container, backgroundColor: themeStyles.background}}>{pal && <PalPage pal={pal}></PalPage>}</View>
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
