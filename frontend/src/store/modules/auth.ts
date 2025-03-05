import { Module } from "vuex";
import { AuthState, User } from "@/store/types";

const authModule: Module<AuthState, any> = {
  namespaced: true,
  state: {
    isAuthenticated: false,
    user: null,
  },
  mutations: {
    SET_AUTHENTICATED(state, isAuthenticated: boolean) {
      state.isAuthenticated = isAuthenticated;
    },
    SET_USER(state, user: User | null) {
      state.user = user;
    },
  },
  actions: {
    login({ commit }, user: User) {
      commit("SET_AUTHENTICATED", true);
      commit("SET_USER", user);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout({ commit }) {
      commit("SET_AUTHENTICATED", false);
      commit("SET_USER", null);
      localStorage.removeItem("user");
    },
    initializeStore({ commit }) {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const user: User = JSON.parse(userJson);
        commit("SET_AUTHENTICATED", true);
        commit("SET_USER", user);
      }
    },
  },
};

export default authModule;
