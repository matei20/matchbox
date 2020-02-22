import React from "react";
import { ScrollView, View, StyleSheet, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react/native";
import { observable, action } from "mobx";

import WithAppNav from "../navs/app";
import apiFetch from "../lib/apiFetch";
import photoSrc from "../lib/photo-src";

class MatchesScreen extends React.Component {
  @observable.ref matches = null;

  componentDidMount() {
    apiFetch("matches").then(
      action(r => {
        this.matches = r.map(m => ({
          id: m.ID,
          email: m.EMAIL,
          name: m.NAME,
          age: m.AGE,
          gender: m.GENDER,
          school: m.SCHOOL,
          job: m.JOB,
          company: m.COMPANY,
          description: m.DESCRIPTION,

          photoPath: photoSrc(m.ID)
        }));
      })
    );
  }

  render() {
    if (!this.matches || !this.matches.length) {
      return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.noMorePeople}>
            <Ionicons name="md-time" size={25} />
            <Text style={{ marginLeft: 10, fontSize: 16 }}>No matches yet</Text>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {this.matches.map(m => (
          <View key={m.id}>
            <View>
              <Image
                source={{ uri: m.photoPath }}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.title}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {m.name}
                </Text>
                <Text style={{ fontSize: 20, marginLeft: 8 }}>{m.age}</Text>
              </View>

              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {m.gender}
              </Text>
            </View>

            <View style={styles.fieldWithIcon}>
              <Ionicons name="ios-mail" size={18} />
              <Text style={{ marginLeft: 10 }}>{m.email}</Text>
            </View>

            {m.school && (
              <View style={styles.fieldWithIcon}>
                <Ionicons name="ios-school" size={18} />
                <Text style={{ marginLeft: 10 }}>{m.school}</Text>
              </View>
            )}

            {m.job && (
              <View style={styles.fieldWithIcon}>
                <Ionicons name="ios-briefcase" size={18} />
                <Text style={{ marginLeft: 10 }}>
                  {m.job}, at {m.company}
                </Text>
              </View>
            )}

            {m.description && (
              <View style={styles.description}>
                <Text>{m.description}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20
  },
  title: {
    marginBottom: 10,
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

export default WithAppNav(observer(MatchesScreen));
