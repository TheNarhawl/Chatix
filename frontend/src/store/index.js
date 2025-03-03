import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueCookies from "vue-cookies";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    protocol: window.PANEL_HTTP_PROTOCOL,
    host: window.PANEL_HOST,
    apiHost: window.PANEL_API_HOST,
    port: window.PANEL_PORT,
    protocolWS: window.PANEL_SOCKETS_PROTOCOL,
    user: {},
    mailTo: "",
    error: false,
    errorText: "",
    success: false,
    successText: "",
  },
  getters: {
    baseURL: (state) => {
      return state.protocol + "://" + state.host + ":" + state.port;
    },
    user: (state) => {
      return state.user;
    },
  },
  mutations: {
    userSet(state, user) {
      state.user = user;
    },
    errorSet(state, boolean) {
      state.error = boolean;
      setTimeout(() => {
        state.error = false;
      }, 4000);
    },
    errorTextSet(state, err) {
      if (err && typeof err != "string") {
        if (err.response.data) {
          state.errorText = err.response.data;
        } else {
          state.errorText = "Проблема с подключением";
        }
      } else if (err && typeof err === "string") {
        state.errorText = err;
      } else {
        state.errorText = "Ошибка отправки данных";
      }
    },
    successSet(state, boolean) {
      state.success = boolean;
      setTimeout(() => {
        state.success = false;
      }, 4000);
    },
    successTextSet(state, value) {
      state.successText = value;
    },
  },
  modules: {},
});