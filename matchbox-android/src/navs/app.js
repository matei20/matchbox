import React from "react";
import { observer } from "mobx-react/native";
import { View, Text, StyleSheet } from "react-native";

import { Link, kPaths } from "../router";
import colors from "../constants/colors";

function WithAppNav(ToWrap) {
  class Wrapped extends React.Component {
    render() {
      return (
        <View style={styles.container}>
          <View style={styles.nav}>
            <Link path={kPaths.info} style={styles.link}>
              <Text>Info</Text>
            </Link>

            <Link path={kPaths.swipe} style={styles.link}>
              <Text>Swipe</Text>
            </Link>

            <Link path={kPaths.matches} style={styles.link}>
              <Text>Matches</Text>
            </Link>
          </View>

          <ToWrap />
        </View>
      );
    }
  }

  return observer(Wrapped);
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  nav: {
    flexDirection: "row"
  },
  link: {
    flex: 1,
    alignItems: "center",
    borderBottomColor: colors.navy,
    borderBottomWidth: 2,
    padding: 20
  }
});

export default WithAppNav;
