import userStore from "./user.store";
import { routerStore } from "./router";
import  wsStore  from "./ws.store";

const store = {};
global.store = store;

export function boot() {
  store.user = userStore;
  store.router = routerStore;
  store.ws = wsStore;
}

export default store;
