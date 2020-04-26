import React from "react";
import { ScrollView, View, StyleSheet, Image, Text } from "react-native";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import IconBadge from 'react-native-icon-badge';
import { observer } from "mobx-react/native";
import { observable, action } from "mobx";
import { Link, kPaths } from "../router";

import WithAppNav from "../navs/app";
import apiFetch from "../lib/apiFetch";
import photoSrc from "../lib/photo-src";
import store from "../store";

class MatchesScreen extends React.Component {
  @observable.ref matches = null;

  componentDidMount() {
    this.initMatches()
    if (!store.ws.wasInitialized)
      this.initConversations()
  }
  initMatches() {
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
          distance: m.MAXDISTANCE,
          city: m.CITY,
          unreadCount: m.UNREADCOUNT > 9 ? "9+" : m.UNREADCOUNT,
          photoPath: photoSrc(m.ID)
        }));
      })
    )
  }

  initConversations() {
    apiFetch("conversations").then(store.ws.initConversations);
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
            <View style={{ marginTop: 25 }}>
              <Image
                source={{ uri: m.photoPath }}
                style={styles.profileImage}
              />
              <Link path={kPaths.chat} style={styles.link} otherUserId={m.id}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', }}>
                  <IconBadge
                    MainElement={
                      <AntDesign name="message1" size={35} />
                    }
                    BadgeElement={
                      <Text style={{ color: '#FFFFFF', fontSize: 10 }}>{m.unreadCount}</Text>
                    }
                    IconBadgeStyle={
                      {
                        minWidth: 15,
                        width: 15,
                        height: 15,
                        borderRadius: 15,
                        backgroundColor: '#FF0000'
                      }
                    }
                    Hidden={0 == m.unreadCount}//add store message unread count
                  />
                </View>

              </Link>
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

            <View style={styles.location}>
              <Entypo name="location-pin" size={18} color="#484848" />
              <Text style={{ marginLeft: 4, color: "#484848" }}>{m.city}, {m.distance} km away</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  imageAndChat: {
    borderTopColor: "#d3d3d3",
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#d3d3d3"
  },
  location: {
    marginBottom: 10,
    alignItems: "center",
    marginLeft: -2,
    flexDirection: "row"
  },
  noMorePeople: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  link: {
    position: "absolute",
    right: 0,
    top: 0
  }
});

export default WithAppNav(observer(MatchesScreen));
