<template>
  <RouterView></RouterView>
</template>

<script>
import { RouterView } from "vue-router";

export default {
  name: "App",
  components: {
    RouterView
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
  background-color: #110e21;
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

</style>
