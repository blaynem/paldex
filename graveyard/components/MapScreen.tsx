import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getCurrentThemeStyles } from "./Themed";

export default function MapScreen() {
  const themeStyles = getCurrentThemeStyles();
  return (
    <View style={{...styles.container, backgroundColor: themeStyles.background}}>
      <Text style={{color: themeStyles.background}}>coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 32,
    marginBottom: 10,
  },
  description: {
    marginTop: 20,
    textAlign: "center",
  },
});
