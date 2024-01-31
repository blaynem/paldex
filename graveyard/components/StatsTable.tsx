import React from "react";
import { View, Text, StyleSheet } from "react-native";

export type PalStats_Type = {
  health: string;
  hunger: string;
  sanity: string;
  attack: string;
  defense: string;
  work_speed: string;
};

const StatsTable = ({ stats }: { stats: PalStats_Type }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.header}>Stats</Text>
        <Text style={styles.header}>Values</Text>
      </View>
      {Object.entries(stats).map(([stat, value]) => (
        <View key={stat} style={styles.row}>
          <Text style={styles.stats}>{stat}</Text>
          <Text style={styles.stats}>{value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    margin: 10,
    color: "#FFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    color: "#FFF",
  },
  header: {
    fontWeight: "bold",
    color: "#FFF",
  },
  stats: {
    color: "#FFF",
  },
});

export default StatsTable;
