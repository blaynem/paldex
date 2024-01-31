import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getCurrentThemeStyles } from "./Themed";

interface StatSubTitleBarProps {
  title: string;
  children?: React.ReactNode;
}

const StatSubTitleBar: React.FC<StatSubTitleBarProps> = ({
  title,
  children,
}) => {
  const themeStyles = getCurrentThemeStyles();
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={{...styles.bar, backgroundColor: themeStyles.text}} />
        <View style={{ paddingLeft: 5, paddingRight: 5 }}>
          <Text style={{ ...styles.title, color: themeStyles.text }}>
            {title}
          </Text>
        </View>
        <View style={{...styles.bar, backgroundColor: themeStyles.text}} />
      </View>
      <View style={{...styles.bar, backgroundColor: themeStyles.text}}></View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    marginBottom: 12,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  bar: { flex: 1, height: 1},
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
});

export default StatSubTitleBar;
