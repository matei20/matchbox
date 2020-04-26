import React from "react";
import { TouchableOpacity, View } from "react-native";
import bind from "bind-decorator";

import store from "../store";
import { observer } from "mobx-react/native";
import apiFetch from "../lib/apiFetch";

class Link extends React.Component {
  @bind
  handleOnPress() {
    const { path } = this.props;
    const { otherUserId } = this.props;
    store.ws.otherUserId = otherUserId;
    
    store.router.navigate(path);
  }

  render() {
    const { children, style, path } = this.props;

    const selectedStyle = {
      backgroundColor: path === store.router.path ? "#efefef" : "fff"
    };

    return (
      <TouchableOpacity
        onPress={this.handleOnPress}
        style={[style, selectedStyle]}
      >
        <View>{children}</View>
      </TouchableOpacity>
    );
  }
}

export default observer(Link);
