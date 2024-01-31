import MAP_IMAGE_LINKS from "@/assets/images/world_map";
import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, LayoutChangeEvent } from "react-native";
import {
  Coordinate,
  LoadedMonsterData,
  monsterDataMapping,
} from "./data/map_locations";
import IconToggle from "@/components/Toggle";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { getCurrentThemeStyles } from "@/components/Themed";

function loadMonsterData(monsterName: string): LoadedMonsterData | null {
  try {
    const data =
      monsterDataMapping[monsterName as keyof typeof monsterDataMapping];
    if (data) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// TODO:
// - Add day time vs nightime toggle.

// Grabbed from the WorldMapUiData (hidden somehow?)
const inGameMapSize: MapSize = {
  max: {
    x: 335112.0,
    y: 617000.0,
  },
  min: {
    x: -582888.0,
    y: -301000.0,
  },
};

interface MapSize {
  max: {
    x: number;
    y: number;
  };
  min: {
    x: number;
    y: number;
  };
}

interface ScaledCoordinate {
  x: number;
  y: number;
  z: number;
}

function convertCoordinates(
  coordinates: Coordinate[],
  mapsize: MapSize,
  imageWidth: number,
  imageHeight: number
): ScaledCoordinate[] {
  const rangeX = mapsize.max.x - mapsize.min.x;
  const rangeY = mapsize.max.y - mapsize.min.y;

  return coordinates.map((coord) => {
    const normalizedX = (coord.X - mapsize.min.x) / rangeX;
    const normalizedY = (coord.Y - mapsize.min.y) / rangeY;

    const scaledX = normalizedX * imageWidth;
    // Inverting Y-axis here
    const scaledY = (1 - normalizedY) * imageHeight;

    return { x: scaledX, y: scaledY, z: coord.Z };
  });
}

type MapComponentProps = {
  pal_dev_names: string;
  nocturnal?: boolean;
};

export const MonsterHeatMap = (props: MapComponentProps) => {
  const themeStyles = getCurrentThemeStyles();
  const [daytime, setDaytime] = useState(true);
  const [monsterData, setMonsterData] = useState<LoadedMonsterData | null>(
    null
  );
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  useEffect(() => {
    // TODO: We need to somehow merge this data better.
    // Doing it this way causes performance issues.
    // if (Array.isArray(props.pal_dev_names)) {
    //   for (const dev_name of props.pal_dev_names) {
    //     const _data = loadMonsterData(dev_name);
    //     if (!_data) continue;
    //     if (!data) {
    //       data = _data;
    //       continue;
    //     }
    //     data.dayTimeLocations.locations = [
    //       ...data.dayTimeLocations.locations,
    //       ..._data.dayTimeLocations.locations,
    //     ];
    //     data.nightTimeLocations.locations = [
    //       ...data.nightTimeLocations.locations,
    //       ..._data.nightTimeLocations.locations,
    //     ];
    //   }
    // } else {
    // }
    const data = loadMonsterData(props.pal_dev_names);
    // Load monster data dynamically based on props.dev_name
    // const data = props.dev_name loadMonsterData(props.dev_name);
    if (data) {
      setMonsterData(data);
    }
  }, [props.pal_dev_names]);

  const { image } = MAP_IMAGE_LINKS.Map_M;

  const locations = monsterData
    ? monsterData[daytime ? "dayTimeLocations" : "nightTimeLocations"].locations
    : ([] as Coordinate[]);

  const nodes = convertCoordinates(
    locations,
    inGameMapSize,
    containerSize.width,
    containerSize.height
  );

  return (
    <View style={styles.mapContainer}>
      <View
        style={{
          marginBottom: 8,
          position: "relative",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <IconToggle
          leftText="Day"
          rightText="Night"
          LeftIcon={<Feather name={"sun"} size={24} color={"#333"} />}
          RightIcon={
            <Feather name={"moon"} size={24} color={"#333"} fill="red" />
          }
          onToggle={setDaytime}
        />
        {props.nocturnal && (
          <MaterialCommunityIcons
            name="owl"
            size={24}
            color={themeStyles.text}
            style={{ position: "absolute", right: 0, alignSelf: "center" }}
          />
        )}
      </View>
      <View style={{ position: "relative" }}>
        <Image onLayout={onLayout} source={image} style={styles.mapImage} />
        {nodes.map((node, index) => {
          return (
            <View
              key={index}
              style={[
                styles.nodeBase,
                daytime ? styles.nodeDay : styles.nodeNight,
                {
                  top: containerSize.width - node.x - styles.nodeBase.width / 2,
                  left:
                    containerSize.height - node.y - styles.nodeBase.height / 2,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1, // This ensures the container maintains a 1:1 aspect ratio
  },
  mapImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // Use "contain" to fit the image within the container while preserving aspect ratio
  },
  nodeBase: {
    position: "absolute",
    width: 10,
    height: 10,
    opacity: 0.3,
    borderRadius: 5,
  },
  nodeNight: {
    backgroundColor: "cyan",
  },
  nodeDay: {
    backgroundColor: "khaki",
  },
});
