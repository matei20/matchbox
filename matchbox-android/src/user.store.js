import { observable, action, computed } from "mobx";
import bind from "bind-decorator";

import apiFetch from "./lib/apiFetch";
import store from "./store";

class UserStore {
  @observable token = null;

  @computed get isAuthenticated() {
    return Boolean(this.token);
  }

  @action
  login(token) {
    this.token = token;
    store.router.navigate("swipe");
    store.ws.newconnection(this.token);
  }

  @action
  logout() {
    this.token = null;
    store.ws.closeconnection();
    store.ws.wasInitialized = false;
  }

  @bind
  fetchLogIn(email, password) {
    return apiFetch("login", { email, password });
  }

  @bind
  fetchRegister(email, password, rePassword) {
    return apiFetch("register", { email, password, rePassword });
  }
}

export default new UserStore();
