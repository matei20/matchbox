import React from "react";
import {
  Button,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text
} from "react-native";
import { observer } from "mobx-react/native";
import { action, observable } from "mobx";

import WithAuthNav from "../navs/auth";
import { FormInput } from "../shared";
import store from "../store";
import bind from "bind-decorator";
import sendLocationInfo from "../location/send-location-info";

class RegisterScreen extends React.Component {
  @observable email = "";
  @observable password = "";
  @observable rePassword = "";
  @observable error = "";

  @action.bound
  onChangeText(prop, text) {
    this[prop] = text;
  }

  @bind
  onSubmit() {
    store.user.fetchRegister(this.email, this.password, this.rePassword).then(
      action(res => {
        if (res.token){
          store.user.login(res.token);
          sendLocationInfo();
        }
        else 
        this.error = res.message;
      })
    );
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />

        <View>
          <FormInput
            label="Email"
            prop="email"
            value={this.email}
            onChangeText={this.onChangeText}
          />

          <FormInput
            secureTextEntry
            label="Password"
            prop="password"
            value={this.password}
            onChangeText={this.onChangeText}
          />

          <FormInput
            secureTextEntry
            label="Confirm password"
            prop="rePassword"
            value={this.rePassword}
            onChangeText={this.onChangeText}
          />

          <Text style={styles.error}>{this.error}</Text>
        </View>

        <Button title="Sign in!" onPress={this.onSubmit} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 20
  },
  logo: {
    height: 120,
    width: "100%",
    resizeMode: "contain"
  },
  error: {
    textAlign: "center",
    color: "red",
    height: 20,
    lineHeight: 20,
    marginTop: 20
  }
});

export default WithAuthNav(observer(RegisterScreen));
