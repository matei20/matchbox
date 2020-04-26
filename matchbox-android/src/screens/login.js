import React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react/native";
import {
  View,
  ScrollView,
  Button,
  Text,
  StyleSheet,
  Image
} from "react-native";
import bind from "bind-decorator";

import WithAuthNav from "../navs/auth";
import { FormInput } from "../shared";
import store from "../store";
import locationInfo from "../location/locationInfo";
import apiFetch from "../lib/apiFetch";

class LogInScreen extends React.Component {
  @observable email = "simon@gmail.com";
  @observable password = "1234";
  @observable error = "";

  @action.bound
  onChangeText(prop, text) {
    this[prop] = text;
  }

  @bind
  async onSubmit() {
    location = await locationInfo();
    if (location) {
      store.user.fetchLogIn(this.email, this.password).then(
        action(res => {
          if (res.token) {
            store.user.login(res.token);
            apiFetch('save-user-location', location);

          }
          else this.error = res.message;
        })
      );
    }
    else
      this.error = "Turn on location!";
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

          <Text style={styles.error}>{this.error}</Text>
        </View>

        <Button title="Log in!" onPress={this.onSubmit} />
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

export default WithAuthNav(observer(LogInScreen));
