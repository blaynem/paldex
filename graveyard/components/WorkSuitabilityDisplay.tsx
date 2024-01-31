import React from "react";
import { Text, StyleSheet, Image } from "react-native";
import { getWorkSuitabilityIcon} from "@/utils/utils";
import { getCurrentThemeStyles } from "./Themed";

type WorkSuitabilityDisplayProps = {
  work_type: string;
  work_value: number;
  small: boolean;
};
const WorkSuitabilityDisplay = ({
  work_type,
  work_value,
  small,
}: WorkSuitabilityDisplayProps) => {
  const themeStyles = getCurrentThemeStyles();
  return (
    <Text key={work_type} style={{...styles.container, color: themeStyles.text}}>
      <Image
        style={small ? styles.iconSmall : styles.icon}
        source={getWorkSuitabilityIcon(work_type)}
      ></Image>
      <Text>{work_value}</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
  },
  text: {
    marginLeft: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconSmall: {
    width: 30,
    height: 30,
  },
});

export default WorkSuitabilityDisplay;
