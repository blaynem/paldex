import { Pals_Type } from "@/types/types";
import { getPalById, getPalIconSource, getPals, getDevNameForUniqueBreeds } from "@/utils/utils";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { calculateBreedingResult } from "../breeding_calc";
import PalBar from "@/components/PalBar";
import Dropdown from "@/components/Picker";
import { getCurrentThemeStyles, Text } from "@/components/Themed";


// Filter out any unique pals from the list
const pals = getPals().filter((pal) => {
  return !getDevNameForUniqueBreeds().includes(pal.pal_dev_name);
});

const BreedingCalculator = () => {
  // Need to remove the unique required breed pals from the list
  const themeStyles = getCurrentThemeStyles();
  const [dropdown1Value, setDropdown1Value] = useState({} as Pals_Type);
  const [dropdown2Value, setDropdown2Value] = useState({} as Pals_Type);
  const [breedingResult, setBreedingResult] = useState<Pals_Type | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const handleDropdown1Change = (value: Pals_Type) => {
    if (!value.pal_dev_name) {
      setBreedingResult(null);
    }
    setDropdown1Value(value);
  };

  const handleDropdown2Change = (value: Pals_Type) => {
    if (!value.pal_dev_name) {
      setBreedingResult(null);
    }
    setDropdown2Value(value);
  };

  const handleCalculate = () => {
    if (!dropdown1Value.pal_name || !dropdown2Value.pal_name) return;
    let tempPal = calculateBreedingResult(
      dropdown1Value.pal_name,
      dropdown2Value.pal_name
    );
    let pal = getPalById(tempPal.index);

    if (pal) {
      let palImage = getPalIconSource(pal.pal_dev_name);
      setBreedingResult(pal);
      setImageSrc(palImage);
    }
  };
  return (
    <View style={{ ...styles.container, backgroundColor: themeStyles.background }}>
      <View style={styles.pickerContainer}>
        <Text style={styles.text}>Parent 1</Text>
        <Dropdown
          selectedItem={dropdown1Value}
          setSelectedItem={handleDropdown1Change}
          data={pals.map((pal) => {
            return { pal: pal };
          })}
        />
        {dropdown1Value.pal_name && (
          <View style={styles.palBarContainer}>
            <PalBar pal={dropdown1Value} image={imageSrc}></PalBar>
          </View>
        )}
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.text}>Parent 2</Text>
        <Dropdown
          selectedItem={dropdown2Value}
          setSelectedItem={handleDropdown2Change}
          data={pals.map((pal) => {
            return { pal: pal };
          })}
        />
        {dropdown2Value.pal_name && (
          <View style={styles.palBarContainer}>
            <PalBar pal={dropdown2Value} image={imageSrc}></PalBar>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={{...styles.calculateButton, backgroundColor: themeStyles.background, borderWidth: 1, borderColor: themeStyles.text}}
        onPress={() => handleCalculate()}
      >
        <Text style={{...styles.calculateButtonText, color: themeStyles.text}}>Calculate Breed</Text>
      </TouchableOpacity>
      {breedingResult && (
        <View style={styles.palBarContainer}>
          <Text style={styles.text}>Result</Text>
          <PalBar pal={breedingResult} image={imageSrc}></PalBar>
        </View>
      )}
    </View>
  );
};

export default BreedingCalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  calculateButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  calculateButtonText: {
    fontWeight: "bold",
  },
  palBarContainer: {
    marginTop: 20,
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
});
