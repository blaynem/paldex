import { Pals_Type } from "@/types/types";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import ElementsContainer from "./ElementsContainer";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { getPalIconSource } from "@/utils/utils";
import WorkSuitabilityDisplay from "./WorkSuitabilityDisplay";
import { getCurrentThemeStyles } from "./Themed";

export type PalBarProps = {
  pal: Pals_Type;
};

type WorkSuitability = {
  work_type: string;
  work_value: number;
};

const PalBar = ({ pal }: PalBarProps) => {
  const themeStyles = getCurrentThemeStyles();
  const imageSrc = getPalIconSource(pal.pal_dev_name);
  const theme = useTheme();

  const work_suitability: WorkSuitability[] = Object.keys(pal.work_suitability)
    .map((key) => {
      const workKey = key as keyof typeof pal.work_suitability;
      return { work_type: key, work_value: pal.work_suitability[workKey] };
    })
    .filter((suitability) => suitability.work_value > 0);

  return (
    <TouchableOpacity
      onPress={() => {
        router.navigate({
          pathname: `/PalProfile/[id]`,
          params: { id: pal.pal_index },
        });
      }}
    >
      <View
        style={{ ...styles.container, backgroundColor: themeStyles.background }}
      >
        <View style={styles.leftColumn}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              color: theme.colors.text,
              fontWeight: "bold",
              fontSize: 40,
            }}
          >
            {pal.pal_index}
          </Text>
        </View>
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
          <View style={{ marginTop: 4, marginLeft: 4 }}>
            <ElementsContainer elements={pal.pal_type} id={pal.pal_index} />
          </View>
          <View style={styles.workContainer}>
            {work_suitability.map((suitability) => {
              return (
                <WorkSuitabilityDisplay
                  key={suitability.work_type}
                  {...suitability}
                  small={true}
                />
              );
            })}
          </View>
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
  leftColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  middleColumn: {
    flex: 3,
    alignItems: "flex-start",
    flexDirection: "column",
    marginTop: 5,
    marginBottom: -10,
  },
  rightColumn: {
    flex: 2,
    alignItems: "flex-end",
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  workContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Adjust vertical alignment if needed
    flexWrap: "wrap",
  },
});

export default PalBar;
