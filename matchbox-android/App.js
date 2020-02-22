import React from "react";
import { AppLoading, Asset, Font, Icon } from "expo";
import { observer } from "mobx-react/native";
import { observable, action } from "mobx";

import { Router } from "./src/router";

@observer
class App extends React.Component {
  @observable isLoading = true;

  async loadResources() {
    return Promise.all([
      Asset.loadAsync([
        require("./src/assets/images/default_profile_photo.png"),
        require("./src/assets/images/school.png"),
        require("./src/assets/images/job.png"),
        require("./src/assets/images/logo.png")
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        "space-mono": require("./src/assets/fonts/SpaceMono-Regular.ttf")
      })
    ]);
  }

  handleError(err) {
    console.warn(err);
  }

  @action.bound
  handleFinish() {
    this.isLoading = false;
  }

  render() {
    if (this.isLoading)
      return (
        <AppLoading
          startAsync={this.loadResources}
          onError={this.handleError}
          onFinish={this.handleFinish}
        />
      );

    return <Router />;
  }
}

import { boot } from "./src/store";
boot();

export default observer(App);
