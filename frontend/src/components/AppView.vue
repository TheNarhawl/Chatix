<template>
  <Navigation></Navigation>
  <div class="dialogs-wrapper">
    <ChatList></ChatList>
    <Chat></Chat>
  </div>
</template>

<script>
import Chat from "./Chat.vue";
import ChatList from "./ChatList.vue";
import Navigation from "./Navigation.vue";
</script>

<style scoped>
.dialogs-wrapper {
  display: flex;
  flex-direction: row;
}
</style>
