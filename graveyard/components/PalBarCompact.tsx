import { Pals_Type } from "@/types/types";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import {  getPalIconSource } from "@/utils/utils";
import { getCurrentThemeStyles } from "./Themed";

export type PalBarProps = {
  pal: Pals_Type;
};

const PalBarCompact = ({ pal }: PalBarProps) => {
  const themeStyles = getCurrentThemeStyles();
  const imageSrc = getPalIconSource(pal.pal_dev_name);
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        router.navigate({
          pathname: `/PalProfile/[id]`,
          params: { id: pal.pal_index },
        });
      }}
    >
      <View style={{...styles.container, backgroundColor: themeStyles.background}}>
        <View style={styles.middleColumn}>
          <Text
            style={{
              color: theme.colors.text,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {pal.pal_name}
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
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  middleColumn: {
    flex: 3,
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 5,
    marginBottom: -10,
  },
  rightColumn: {
    flex: 1,
    alignItems: "flex-end",
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});

export default PalBarCompact;
