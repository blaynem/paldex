import {
  addNewLine,
  getHumans,
  getItemDroppers,
  getItemIconSource,
  getRecipesThatRequireItem,
  getPalIconSource,
  getPals,
  getRecipeForItem,
  mapPalType,
} from "@/utils/utils";

import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, FlatList } from "react-native";
import StatSubTitleBar from "./StatSubTitleBar";
import { getCurrentThemeStyles, Text } from "./Themed";
import { PalBarProps } from "./PalBar";
import PalBarCompact from "./PalBarCompact";
import { router } from "expo-router";
import { TransformedItemDetails } from "@/data-provider/transformers/types";
import { rarityStars } from "./RarityStars";

const getHumansData = (list: string[]): string[] => {
  const names = getHumans()
    .filter((human) => list.includes(human.pal_dev_name))
    .map((human) => human.pal_name);

  const uniqueNames = [...new Set(names)];
  return uniqueNames.sort();
};

const getPalData = (list: string[]): PalBarProps[] =>
  getPals()
    .map((pal) => {
      return {
        pal: { ...pal, pal_type: mapPalType(pal.pal_type) },
        image: getPalIconSource(pal.pal_name),
      };
    })
    .filter((item) => {
      if (list) {
        return (
          item.pal.pal_index != "-1" &&
          item.pal.pal_index != "-2" &&
          list.includes(item.pal.pal_name)
        );
      }
      return item.pal.pal_index != "-1" && item.pal.pal_index != "-2";
    })
    .sort((a, b) => {
      return parseInt(a.pal.pal_index) - parseInt(b.pal.pal_index);
    });

// TODO: Heatmap of locations. Should it include pals list? Humans? Both?
const ItemPage = ({ item }: { item: TransformedItemDetails }) => {
  const themeStyles = getCurrentThemeStyles();
  const imageSrc = getItemIconSource(item.item_dev_name);
  const recipeData = getRecipeForItem(item.item_dev_name);
  const usedToCraft = getRecipesThatRequireItem(item.item_dev_name);

  const [droppersNames, setDroppersNames] = useState(
    getItemDroppers(item.item_dev_name).map((d) => d.name)
  );
  const [palsData] = useState(getPalData(droppersNames));
  const [humanData] = useState(getHumansData(droppersNames));

  useEffect(() => {
    setDroppersNames(getItemDroppers(item.item_dev_name).map((d) => d.name));
  }, [item.item_dev_name]);

  const isCraftable = recipeData != null;

  const extraStats: (keyof TransformedItemDetails)[] = [
    // "consumed_on_use",
    "corruption_factor",
    "durability",
    "hp_value",
    "magazine_size",
    "magic_attack_value",
    "magic_defense_value",
    "physical_attack_value",
    "physical_defense_value",
    "price",
    "shield_value",
    "sneak_attack_rate",
    "weight",
  ];

  return (
    <FlatList
      ListHeaderComponent={
        <View style={{ position: "relative" }}>
          {item.rarity > 0 && (
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                right: 0,
                alignItems: "center",
              }}
            >
              <Text>Rarity: </Text>
              {rarityStars(item.rarity)}
            </View>
          )}
          <Image source={imageSrc} style={styles.profileImage} />
          <View style={styles.nameContainer}>
            <Text style={{ ...styles.leftText, color: themeStyles.text }}>
              {item.item_name}
            </Text>
          </View>
          <StatSubTitleBar title="Description">
            <Text style={{ ...styles.description, color: themeStyles.text }}>
              {addNewLine(item.item_description)}
            </Text>
          </StatSubTitleBar>
          {isCraftable && (
            <StatSubTitleBar title="Craftable">
              <View style={styles.rowContainer}>
                <View style={styles.row}>
                  <Text style={styles.rowText}>
                    <Text style={{ fontWeight: "bold" }}>Materials:</Text>{" "}
                    {recipeData.required_materials.map((material, i) => {
                      return (
                        <Text key={material.dev_name}>
                          <Text>{material.amount}x </Text>
                          <Text
                            style={{ textDecorationLine: "underline" }}
                            key={material.dev_name}
                            onPress={() => {
                              router.navigate({
                                pathname: `/ItemPage/[id]`,
                                params: { id: material.dev_name },
                              });
                            }}
                          >
                            {material.name}
                          </Text>
                          {i < recipeData.required_materials.length - 1
                            ? ", "
                            : ""}
                        </Text>
                      );
                    })}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowText}>
                    <Text style={{ fontWeight: "bold" }}>Amount Created:</Text>{" "}
                    {recipeData.creates_amount}
                  </Text>
                  <Text style={styles.rowText}>
                    <Text style={{ fontWeight: "bold" }}>Craft Time:</Text>{" "}
                    {recipeData.work_required}
                  </Text>
                </View>
                {recipeData.unlocked_by_item && (
                  <View style={styles.row}>
                    <Text style={styles.rowText}>
                      <Text style={{ fontWeight: "bold" }}>Unlocked By:</Text>{" "}
                      {recipeData.unlocked_by_item.name}
                    </Text>
                  </View>
                )}
              </View>
            </StatSubTitleBar>
          )}
          {item.restore_effects && (
            <StatSubTitleBar title="Restore Effects">
              <View style={styles.rowContainer}>
                {Object.entries(item.restore_effects)
                  .filter(([_, effectValue]) => effectValue > 0)
                  .map(([effectKey, effectValue], index) => (
                    <View key={index} style={styles.row}>
                      <Text style={styles.rowText}>
                        <Text style={{ fontWeight: "bold" }}>
                          {effectKey
                            .replace("restore_", "")
                            .charAt(0)
                            .toUpperCase() +
                            effectKey.replace("restore_", "").slice(1)}
                          :
                        </Text>{" "}
                        {effectValue}
                      </Text>
                    </View>
                  ))}
              </View>
            </StatSubTitleBar>
          )}
          <StatSubTitleBar title="Other Stats">
            {extraStats.map((stat) => {
              if (item[stat]) {
                const statName = stat
                  .split("_")
                  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                  .join(" ");

                let displayStat = item[stat] as string | number;
                if (stat === "corruption_factor") {
                  // Assuming 'displayStat' is a number representing a fraction (e.g., 0.1234 for 12.34%)
                  // Convert to a percent and format with up to two decimal places
                  displayStat = `${((displayStat as number) * 100).toFixed(
                    2
                  )}%`;
                }
                return (
                  <View key={stat} style={styles.rowContainer}>
                    <View style={styles.row}>
                      <Text style={styles.rowText}>
                        <Text style={{ fontWeight: "bold" }}>{statName}:</Text>{" "}
                        <Text>{displayStat}</Text>
                      </Text>
                    </View>
                  </View>
                );
              }
            })}
          </StatSubTitleBar>
          {item.status_effects && (
            <StatSubTitleBar title="Status Effects">
              <View style={styles.rowContainer}>
                <Text style={{ ...styles.rowText, textAlign: "center" }}>
                  <Text style={{ fontWeight: "bold" }}>Time Active:</Text>{" "}
                  {item.status_effects.effect_time}
                </Text>
                {item.status_effects.effects.map((effect) => (
                  <View key={effect.effect_type} style={styles.row}>
                    <Text style={styles.rowText}>
                      <Text style={{ fontWeight: "bold" }}>
                        {effect.effect_type}:
                      </Text>{" "}
                      {effect.effect_value > 0 ? "+" : "-"}
                      {effect.effect_value}
                    </Text>
                  </View>
                ))}
              </View>
            </StatSubTitleBar>
          )}
          {item.passive_skill && (
            <StatSubTitleBar title="Passive Skill Effect">
              <View style={styles.rowContainer}>
                <Text style={styles.rowText}>
                  <Text style={{ fontWeight: "bold" }}>Skill Name:</Text>{" "}
                  {item.passive_skill.passive_skill_name}
                </Text>
                <Text style={styles.rowText}>
                  <Text style={{ fontWeight: "bold" }}>Skill Description:</Text>{" "}
                  {item.passive_skill.passive_skill_description}
                </Text>
              </View>
            </StatSubTitleBar>
          )}
          {item.active_skill && (
            <StatSubTitleBar title="Active Skill Effect">
              <View style={styles.rowContainer}>
                <Text style={styles.rowText}>
                  <Text style={{ fontWeight: "bold" }}>Skill Name:</Text>{" "}
                  {item.active_skill.active_skill_name}
                </Text>
                <Text style={styles.rowText}>
                  <Text style={{ fontWeight: "bold" }}>Skill Description:</Text>{" "}
                  {item.active_skill.active_skill_description}
                </Text>
              </View>
            </StatSubTitleBar>
          )}
          {usedToCraft.length > 0 && (
            <StatSubTitleBar title="Used in Recipes:">
              <View style={styles.row}>
                <Text style={styles.rowText}>
                  {usedToCraft.map((material, i) => {
                    return (
                      <Text key={material.item_dev_name}>
                        <Text
                          style={{ textDecorationLine: "underline" }}
                          key={material.item_dev_name}
                          onPress={() => {
                            router.navigate({
                              pathname: `/ItemPage/[id]`,
                              params: { id: material.item_dev_name },
                            });
                          }}
                        >
                          {material.item_name}
                        </Text>
                        {i < usedToCraft.length - 1 ? ", " : ""}
                      </Text>
                    );
                  })}
                </Text>
              </View>
            </StatSubTitleBar>
          )}
          {humanData.length > 0 && (
            <StatSubTitleBar title="Dropped By Humans">
              <View style={styles.row}>
                <Text>{humanData.join("\n")}</Text>
              </View>
            </StatSubTitleBar>
          )}
          {palsData.length > 0 && <StatSubTitleBar title="Dropped By Pals" />}
        </View>
      }
      style={styles.flatList}
      data={palsData}
      renderItem={({ item }) => <PalBarCompact pal={item.pal} />}
      // This just gives the bottom of the list some space
      ListFooterComponent={<View style={{ height: 40 }}></View>}
      keyExtractor={(item) => item.pal.pal_index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  craftTextBold: {
    fontWeight: "bold",
  },
  flatList: {
    borderWidth: 1,
    width: "100%",
    padding: 8,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Adjust vertical alignment if needed
    width: "100%",
  },
  leftText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 32,
    marginBottom: 10,
    alignSelf: "center",
  },
  description: {
    textAlign: "left",
    // padding: 10,
  },
  itemDropContainer: {
    flexDirection: "row",
    padding: 5,
  },
  rowContainer: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    padding: 4,
  },
  rowText: {
    flex: 1,
  },
});

export default ItemPage;
