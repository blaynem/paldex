import ElementsContainer from "@/components/ElementsContainer";
import { Pals_Type } from "@/types/types";
import {
  addNewLine,
  getImageSource,
  getItemIconSource,
  getItemNameFromDevName,
  getMenuIconSource,
  getRecipeForItem,
  removeNewLine,
} from "@/utils/utils";
import React, { useEffect } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import StatSubTitleBar from "./StatSubTitleBar";
import WorkSuitabilityDisplay from "./WorkSuitabilityDisplay";
import { getCurrentThemeStyles } from "./Themed";
import { Text } from "./Themed";
import { MonsterHeatMap } from "../app/MonsterHeatMap";
import { ThemeColorsType } from "@/constants/Colors";
import { router } from "expo-router";
import { rarityStars } from "./RarityStars";
import { TransformedRelatedTechnologyData } from "@/data-provider/transformers/types";

export const foodRequiredDisplay = (amount: number) => {
  const foodIcon = getMenuIconSource("T_Icon_foodamount_on");
  // show amount of food icons
  return Array.from({ length: amount }).map((_, i) => {
    return <Image key={i} source={foodIcon} style={{ marginRight: 2 }} />;
  });
};

export const RelatedTechnologyDisplay = ({
  related_technology,
  themeStyles,
}: {
  related_technology: TransformedRelatedTechnologyData;
  themeStyles: ThemeColorsType;
}) => {
  const recipe = getRecipeForItem(related_technology.dev_technology_name);
  const requiredMats = recipe?.required_materials
    .map((mat) => {
      return `${mat.name} x${mat.amount}`;
    })
    .join(", ");
  return (
    <StatSubTitleBar title="Related Tech">
      <Text style={{ ...styles.description, color: themeStyles.text }}>
        <Text
          onPress={() => {
            router.navigate({
              pathname: `/ItemPage/[id]`,
              params: { id: related_technology.dev_technology_name },
            });
          }}
          style={{ fontWeight: "bold", textDecorationLine: "underline" }}
        >
          {related_technology.technology_name}
        </Text>
        {": "}
        {related_technology.description}
      </Text>
      {recipe && (
        <Text
          style={{
            ...styles.description,
            color: themeStyles.text,
            marginTop: 4,
          }}
        >
          <Text style={{ fontStyle: "italic" }}>Recipe: {requiredMats} </Text>
        </Text>
      )}
    </StatSubTitleBar>
  );
};

type WorkSuitability = {
  work_type: string;
  work_value: number;
};

const PalPage = ({ pal }: { pal: Pals_Type }) => {
  const [loadMap, setLoadMap] = React.useState(false);
  const themeStyles = getCurrentThemeStyles();
  const { pal_index, pal_name, partner_skill, pal_type, pal_description } = pal;
  const work_suitability: WorkSuitability[] = Object.keys(pal.work_suitability)
    .map((key) => {
      const workKey = key as keyof typeof pal.work_suitability;
      return { work_type: key, work_value: pal.work_suitability[workKey] };
    })
    .filter((suitability) => suitability.work_value > 0);
  const imageSrc = getImageSource(pal_name);

  // `onLayout` is invoked on Mount and on Layout changes.
  // So we want to load and paint the map after the first mount.
  // This helps increase performance for the initial load.
  const onLayout = () => {
    if (loadMap) return;
    setLoadMap(true);
  };

  return (
    <ScrollView
      onLayout={onLayout}
      contentContainerStyle={{
        ...styles.scrollContainer,
        backgroundColor: themeStyles.background,
      }}
    >
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            right: 0,
            alignItems: "center",
          }}
        >
          <Text>Rarity: </Text>
          {rarityStars(pal.rarity)}
        </View>
        <Image source={imageSrc} style={styles.profileImage} />
        <View style={styles.nameContainer}>
          <Text
            adjustsFontSizeToFit
            style={{ ...styles.rightText, color: themeStyles.text }}
          >
            {pal_name}
          </Text>
          <Text
            adjustsFontSizeToFit
            style={{ ...styles.leftText, color: themeStyles.text }}
          >
            #{pal_index}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <ElementsContainer id={pal_index} elements={pal_type} />
          <View style={{ flexDirection: "row" }}>
            {foodRequiredDisplay(pal.pal_stats.food_amount)}
          </View>
        </View>
        <StatSubTitleBar title="Description">
          <Text style={{ ...styles.description, color: themeStyles.text }}>
            {addNewLine(pal_description)}
          </Text>
        </StatSubTitleBar>
        {pal.related_technology && (
          <RelatedTechnologyDisplay
            related_technology={pal.related_technology}
            themeStyles={themeStyles}
          />
        )}
        <StatSubTitleBar title="Work Suitability">
          <View style={styles.workContainer}>
            {work_suitability.map((suitability) => {
              return (
                <WorkSuitabilityDisplay
                  key={suitability.work_type}
                  {...suitability}
                  small={false}
                />
              );
            })}
          </View>
        </StatSubTitleBar>
        <StatSubTitleBar title="Partner Skill">
          <Text style={{ ...styles.description, color: themeStyles.text }}>
            <Text style={{ fontWeight: "bold" }}>{partner_skill.title}: </Text>
            {partner_skill.description}
          </Text>
        </StatSubTitleBar>
        <StatSubTitleBar title="Active Skills">
          {pal.active_skills.map((skill) => {
            return (
              <View key={skill.id} style={{ marginBottom: 8, width: "100%" }}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginBottom: 4,
                    // borderWidth:1
                  }}
                >
                  <Text>
                    <Image
                      source={getMenuIconSource(
                        `Icon_${skill.element_type}_Type` as any
                      )}
                      style={{ height: 14, width: 14 }}
                    />{" "}
                    <Text style={{ fontWeight: "bold", flexWrap: "wrap" }}>
                      {skill.name} (Lvl {skill.level_learned})
                    </Text>
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Power:</Text>{" "}
                    {skill.power}{" "}
                    <Text style={{ fontWeight: "bold" }}>CT:</Text>{" "}
                    {skill.cool_down_time}
                  </Text>
                </View>
                {skill.is_unique_skill && (
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      marginTop: -4,
                      marginBottom: 4,
                    }}
                  >
                    Unique Skill
                  </Text>
                )}
                <Text>{removeNewLine(skill.description)}</Text>
              </View>
            );
          })}
        </StatSubTitleBar>
        <StatSubTitleBar title="Item Drops">
          <View style={styles.itemDropContainer}>
            <Text style={{ ...styles.leftColumn, color: themeStyles.text }}>
              Item Name
            </Text>
            <Text style={{ ...styles.middleColumn, color: themeStyles.text }}>
              Drop Range
            </Text>
            <Text style={{ ...styles.rightColumn, color: themeStyles.text }}>
              Drop Chance
            </Text>
          </View>
          {pal.item_drops.map((item) => {
            return (
              <View key={item.item_name} style={styles.itemDropContainer}>
                <Text
                  onPress={() => {
                    router.navigate({
                      pathname: `/ItemPage/[id]`,
                      params: { id: item.item_name },
                    });
                  }}
                  key={"container" + item.item_name}
                  style={{ ...styles.leftColumn, color: themeStyles.text }}
                >
                  <Image
                    style={styles.icon}
                    source={getItemIconSource(item.item_name)}
                  ></Image>{" "}
                  {getItemNameFromDevName(item.item_name)}
                </Text>
                <Text
                  key={"droprange" + item.min_drop + item.item_name}
                  style={{ ...styles.middleColumn, color: themeStyles.text }}
                >
                  {item.min_drop} - {item.max_drop}
                </Text>
                <Text
                  key={item.drop_rate + item.item_name + pal.pal_index}
                  style={{ ...styles.rightColumn, color: themeStyles.text }}
                >
                  {item.drop_rate}%
                </Text>
              </View>
            );
          })}
        </StatSubTitleBar>
        <StatSubTitleBar title="Stats">
          <View style={styles.rowContainer}>
            <View style={styles.row}>
              <Text style={styles.rowText}>
                <Text style={{ fontWeight: "bold" }}>Health:</Text>{" "}
                {pal.pal_stats.hp}
              </Text>
              <Text style={styles.rowText}>
                <Text style={{ fontWeight: "bold" }}>Attack:</Text>{" "}
                {pal.pal_stats.melee_attack}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>
                <Text style={{ fontWeight: "bold" }}>Ranged:</Text>{" "}
                {pal.pal_stats.shot_attack}
              </Text>
              <Text style={styles.rowText}>
                <Text style={{ fontWeight: "bold" }}>Defense:</Text>{" "}
                {pal.pal_stats.defense}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>
                <Text style={{ fontWeight: "bold" }}>Stamina:</Text>{" "}
                {pal.pal_stats.stamina}
              </Text>
              <Text style={styles.rowText}>
                <Text style={{ fontWeight: "bold" }}>Walk Speed:</Text>{" "}
                {pal.pal_stats.walk_speed}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>
                <Text style={{ fontWeight: "bold" }}>Run Speed:</Text>{" "}
                {pal.pal_stats.run_speed}
              </Text>
              <Text style={styles.rowText}>
                <Text style={{ fontWeight: "bold" }}>Ride Speed:</Text>{" "}
                {pal.pal_stats.ride_sprint_speed}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>
                <Text style={{ fontWeight: "bold" }}>Transport Speed:</Text>{" "}
                {pal.pal_stats.transport_speed}
              </Text>
            </View>
          </View>
        </StatSubTitleBar>
        {loadMap && (
          <StatSubTitleBar title="Map Location">
            <MonsterHeatMap
              pal_dev_names={pal.pal_dev_name}
              nocturnal={pal.nocturnal}
            />
          </StatSubTitleBar>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    marginBottom: 70,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Adjust vertical alignment if needed
    width: "100%",
  },
  workContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Adjust vertical alignment if needed
    flexWrap: "wrap",
  },
  leftText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rightText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileImage: {
    width: 225,
    height: 150,
    borderRadius: 32,
    marginBottom: 10,
    alignSelf: "center",
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  description: {
    textAlign: "left",
  },
  itemDropContainer: {
    flexDirection: "row",
    padding: 5,
  },
  leftColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  middleColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  rightColumn: {
    flex: 1,
    alignItems: "flex-end",
    borderRadius: 5,
    textAlign: "center",
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

export default PalPage;
