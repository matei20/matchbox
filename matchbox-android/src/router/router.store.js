import { observable, action } from "mobx";

class RouterStore {
  @observable path = "login";

  @action
  navigate(path) {
    this.path = path;
  }
}

export default new RouterStore();
