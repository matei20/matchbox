import React from "react";
import {
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  StyleSheet,
  Button
} from "react-native";
import { action, observable } from "mobx";

import { FormInput, GenderSelect } from "../shared";
import WithAppNav from "../navs/app";
import { observer } from "mobx-react/native";

import apiFetch from "../lib/apiFetch";
import deleteImage from "../lib/delete-image";
import uploadImage from "../lib/upload-image";
import bind from "bind-decorator";
import photoSrc from "../lib/photo-src";
import store from "../store";
import { Ionicons } from "@expo/vector-icons";

class InfoScreen extends React.Component {
  @observable id = null;
  @observable photoPath;
  @observable name;
  @observable age;
  @observable gender;
  @observable school;
  @observable job;
  @observable company;
  @observable description;

  componentDidMount() {
    apiFetch("user-info").then(
      action(r => {
        this.id = r.ID;
        this.name = r.NAME || "";
        this.age = r.AGE || 18;
        this.gender = r.GENDER || "";
        this.school = r.SCHOOL || "";
        this.job = r.JOB || "";
        this.company = r.COMPANY || "";
        this.description = r.DESCRIPTION || "";

        this.photoPath = photoSrc(this.id);
      })
    );
  }

  @bind
  onEndEditing() {
    apiFetch("user-info", {
      name: this.name,
      age: this.age,
      gender: this.gender,
      school: this.school,
      job: this.job,
      company: this.company,
      description: this.description
    });
  }

  @action.bound
  onChange(prop, text) {
    this[prop] = text;
  }

  @action.bound
  onChangeInt(prop, text) {
    this[prop] = parseInt(text) || 0;
  }

  @action.bound
  onChangeGender(value) {
    this.gender = value;
    this.onEndEditing();
  }

  @bind handleUpload() {
    uploadImage().then(() => (this.photoPath = photoSrc(this.id)));
  }

  @bind handleLogout() {
    store.user.logout();
  }

  @bind handleDeleteAccount() {
    apiFetch("delete-user").then(this.handleLogout);
  }

  @bind handleDeleteImage() {
    deleteImage().then(() => (this.photoPath = photoSrc(this.id)));
  }

  render() {
    if (!this.id) {
      return null;
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <Image source={{ uri: this.photoPath }} style={styles.profileImage} />
          <TouchableOpacity
            onPress={this.handleDeleteImage}
            style={{ position: "absolute", right: 0, top: 0 }}
          >
            <Ionicons name="ios-remove-circle-outline" size={22} />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Button title="Upload photo" onPress={this.handleUpload} />
        </View>

        <FormInput
          label="Name"
          prop="name"
          value={this.name}
          onChangeText={this.onChange}
          onEndEditing={this.onEndEditing}
        />

        <View style={styles.twoContainer}>
          <View style={styles.sideContainer}>
            <FormInput
              label="Age"
              prop="age"
              value={this.age.toString()}
              onChangeText={this.onChangeInt}
              onEndEditing={this.onEndEditing}
            />
          </View>

          <View style={styles.sideContainer}>
            <GenderSelect
              selected={this.gender}
              onChange={this.onChangeGender}
            />
          </View>
        </View>

        <FormInput
          label="School"
          prop="school"
          value={this.school}
          onChangeText={this.onChange}
          onEndEditing={this.onEndEditing}
        />

        <FormInput
          label="Job"
          prop="job"
          value={this.job}
          onChangeText={this.onChange}
          onEndEditing={this.onEndEditing}
        />

        <FormInput
          label="Company"
          prop="company"
          value={this.company}
          onChangeText={this.onChange}
          onEndEditing={this.onEndEditing}
        />

        <FormInput
          textArea
          label="Description"
          prop="description"
          value={this.description}
          onChangeText={this.onChange}
          onEndEditing={this.onEndEditing}
        />

        <View style={{ marginBottom: 20 }}>
          <Button title="Logout" onPress={this.handleLogout} />
        </View>

        <View>
          <Button title="Delete account" onPress={this.handleDeleteAccount} />
        </View>
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
    justifyContent: "space-between"
  },
  sideContainer: {
    width: "40%"
  },
  profileImage: {
    height: 160,
    borderRadius: 400,
    resizeMode: "contain",
    marginBottom: 20
  }
});

export default WithAppNav(observer(InfoScreen));
