import userStore from "./user.store";
import { routerStore } from "./router";

const store = {};
global.store = store;

export function boot() {
  store.user = userStore;
  store.router = routerStore;
}

export default store;
