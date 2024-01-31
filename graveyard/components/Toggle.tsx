import React, { ReactElement, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getCurrentThemeStyles } from "./Themed";

type DayNightToggleProps = {
  leftText: string;
  rightText: string;
  LeftIcon?: ReactElement;
  RightIcon?: ReactElement;
  onToggle?: (isDayTime: boolean) => void;
};
const IconToggle = ({
  onToggle,
  LeftIcon,
  leftText,
  RightIcon,
  rightText,
}: DayNightToggleProps) => {
  const themeStyles = getCurrentThemeStyles();
  const [isDayTime, setIsDayTime] = useState(true);

  const toggleDayNight = () => {
    const newTime = !isDayTime;
    setIsDayTime(newTime);
    onToggle && onToggle(newTime);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleDayNight}
        style={[
          styles.toggleButton,
          isDayTime ? { backgroundColor: "#FFC975" } : styles.inactiveButton,
        ]}
      >
        {LeftIcon && LeftIcon}
        <Text
          style={{
            ...styles.toggleText,
            color: themeStyles.background,
          }}
        >
          {leftText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={toggleDayNight}
        style={[
          styles.toggleButton,
          !isDayTime ? styles.activeButton : styles.inactiveButton,
        ]}
      >
        {RightIcon && RightIcon}
        <Text style={{ ...styles.toggleText, color: themeStyles.background }}>
          {rightText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  toggleText: {
    fontWeight: "bold",
  },
  activeButton: {
    backgroundColor: "lightblue",
  },
  inactiveButton: {
    backgroundColor: "lightgray",
  },
  activeText: {
    color: "white",
  },
  inactiveText: {
    color: "black",
  },
});

export default IconToggle;
