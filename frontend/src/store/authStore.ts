import { defineStore } from "pinia";
import { AuthState, User } from "./types";

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    login(user: User) {
      this.isAuthenticated = true;
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      localStorage.removeItem("user");
    },
    initializeStore() {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const user: User = JSON.parse(userJson);
        this.isAuthenticated = true;
        this.user = user;
      }
    },
  },
});
