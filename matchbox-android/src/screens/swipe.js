import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Button,
  Text
} from "react-native";
import { Ionicons,Entypo } from "@expo/vector-icons";
import { observer } from "mobx-react/native";
import { observable, action } from "mobx";

import WithAppNav from "../navs/app";
import apiFetch from "../lib/apiFetch";
import bind from "bind-decorator";
import photoSrc from "../lib/photo-src";

class SwipeScreen extends React.Component {
  @observable id;
  @observable photoPath;
  @observable name;
  @observable age;
  @observable gender;
  @observable school;
  @observable job;
  @observable company;
  @observable description;
  @observable city;
  @observable country;
  componentDidMount() {
    this.fetchMatch();
  }

  @bind
  fetchMatch() {
    apiFetch("get-match").then(
      action(r => {
        this.id = r.ID;
        this.name = r.NAME;
        this.age = r.AGE;
        this.gender = r.GENDER;
        this.school = r.SCHOOL;
        this.job = r.JOB;
        this.company = r.COMPANY;
        this.description = r.DESCRIPTION;
        this.city = r.CITY;
        this.country = r.COUNTRY;
        this.photoPath = photoSrc(this.id);
      })
    );
  }

  @bind
  fetchLike() {
    apiFetch("set-like", { id: this.id, like: 1 }).then(this.fetchMatch);
  }

  @bind
  fetchSkip() {
    apiFetch("set-like", { id: this.id, like: 0 }).then(this.fetchMatch);
  }

  render() {
    if (!this.id) {
      return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.noMorePeople}>
            <Ionicons name="md-time" size={25} />
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              No more new people
            </Text>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <Image source={{ uri: this.photoPath }} style={styles.profileImage} />
        </View>

        <View style={styles.title}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {this.name}
            </Text>
            <Text style={{ fontSize: 20, marginLeft: 8 }}>{this.age}</Text>
          </View>

          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {this.gender}
          </Text>
        </View>

        <View style={styles.twoContainer}>
          <View style={styles.sideContainer}>
            <Button title="Skip" onPress={this.fetchSkip} />
          </View>

          <View style={styles.sideContainer}>
            <Button title="Like" onPress={this.fetchLike} />
          </View>
        </View>
        {this.city && this.country && (
          <View style={styles.fieldWithIcon}>
            <Entypo name="location-pin" size={18} />
            <Text style={{ marginLeft: 10 }}>{this.city}, {this.country}</Text>
          </View>
        )}
        {this.school && (
          <View style={styles.fieldWithIcon}>
            <Ionicons name="ios-school" size={18} />
            <Text style={{ marginLeft: 10 }}>{this.school}</Text>
          </View>
        )}

        {this.job && (
          <View style={styles.fieldWithIcon}>
            <Ionicons name="ios-briefcase" size={18} />
            <Text style={{ marginLeft: 10 }}>
              {this.job}, at {this.company}
            </Text>
          </View>
        )}

        {this.description && (
          <View style={styles.description}>
            <Text>{this.description}</Text>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20
  },
  twoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  sideContainer: {
    width: "48%"
  },
  title: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  profileImage: {
    height: 160,
    borderRadius: 400,
    resizeMode: "contain",
    marginBottom: 20
  },
  fieldWithIcon: {
    alignItems: "center",
    marginTop: 5,
    flexDirection: "row"
  },
  description: {
    marginVertical: 20,
    paddingVertical: 20,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#d3d3d3"
  },
  noMorePeople: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default WithAppNav(observer(SwipeScreen));
