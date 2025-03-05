import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/router";
import { useAuthStore } from "./store/authStore";

const app = createApp(App);

app.use(createPinia());
app.use(router);

const authStore = useAuthStore();
authStore.initializeStore();
app.mount("#app");
