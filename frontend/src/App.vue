<template>
  <!-- <AppNavigation></AppNavigation> -->
  <routerView></routerView>
  <div class="dialogs-wrapper">
    <!-- <Dialogs></Dialogs>
      <OpenedDialog></OpenedDialog> -->
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
import ChatList from "./components/ChatList.vue";
import Chat from "./components/Chat.vue";
import Login from "./components/Login.vue";
import { RouterView } from "vue-router";

export default {
  name: "App",
  components: {
    Navigation,
    ChatList,
    Chat,
    Login,
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

* {
  font-family: "Open Sans", serif;
  font-optical-sizing: auto;

  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  max-height: 100vh;
  max-width: 100vw;
  margin: 0;
  padding: 0;
}

.dialogs-wrapper {
  display: flex;
  flex-direction: row;
}
</style>
