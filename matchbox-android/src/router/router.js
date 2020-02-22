import React from "react";
import { observer } from "mobx-react/native";

import kPaths from "./kPaths";
import store from "../store";

import LogInScreen from "../screens/login";
import RegisterScreen from "../screens/register";
import InfoScreen from "../screens/info";
import SwipeScreen from "../screens/swipe";
import MatchesScreen from "../screens/matches";

const authScreens = {
  [kPaths.login]: <LogInScreen />,
  [kPaths.register]: <RegisterScreen />,

  default: <LogInScreen />
};

const appScreens = {
  [kPaths.info]: <InfoScreen />,
  [kPaths.swipe]: <SwipeScreen />,
  [kPaths.matches]: <MatchesScreen />,

  default: <SwipeScreen />
};

@observer
export default class Router extends React.Component {
  render() {
    const screens = store.user.isAuthenticated ? appScreens : authScreens;
    return screens[store.router.path] || screens.default;
  }
}
