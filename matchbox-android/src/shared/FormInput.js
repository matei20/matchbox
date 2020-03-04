import React from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import bind from "bind-decorator";

import Colors from "../constants/colors";

export default class FormInput extends React.Component {
  @bind
  handleTextChange(text) {
    const { onChangeText, prop } = this.props;
    onChangeText(prop, text);
  }

  render() {
    return (
      <>
        <Text>{this.props.label}</Text>
        <TextInput
          style={[styles.formInput, this.props.style]}
          type={this.props.type || "none"}
          placeholder={this.props.label}
          value={this.props.value}
          onChangeText={this.handleTextChange}
          secureTextEntry={this.props.secureTextEntry}
          multiline={this.props.textArea}
          numberOfLines={4}
          onEndEditing={this.props.onEndEditing}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  formInput: {
    height: 40,
    borderColor: Colors.yellow,
    borderBottomWidth: 2,
    marginBottom: 40
  }
});
