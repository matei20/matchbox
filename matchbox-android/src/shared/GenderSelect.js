import React from "react";

import { StyleSheet } from "react-native";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";

import Colors from "../constants/colors";

const radio_props = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" }
];

function GenderSelect({ selected, onChange }) {
  return (
    <RadioForm>
      <RadioButton>
        <RadioButtonInput
          obj={radio_props[0]}
          isSelected={selected === radio_props[0].value}
          onPress={() => onChange(radio_props[0].value)}
          buttonInnerColor={Colors.yellow}
          buttonOuterColor={Colors.yellow}
        />
        <RadioButtonLabel
          obj={radio_props[0]}
          isSelected={selected === radio_props[0].value}
          onPress={() => onChange(radio_props[0].value)}
          labelWrapStyle={styles.label}
        />
      </RadioButton>

      <RadioButton>
        <RadioButtonInput
          obj={radio_props[1]}
          isSelected={selected === radio_props[1].value}
          onPress={() => onChange(radio_props[1].value)}
          buttonInnerColor={Colors.yellow}
          buttonOuterColor={Colors.yellow}
        />
        <RadioButtonLabel
          obj={radio_props[1]}
          isSelected={selected === radio_props[1].value}
          onPress={() => onChange(radio_props[1].value)}
          labelWrapStyle={styles.label}
        />
      </RadioButton>
    </RadioForm>
  );
}

const styles = StyleSheet.create({
  label: {
    marginLeft: 10
  }
});

export default GenderSelect;
