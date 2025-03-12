<template>
  <Navigation @toggle-chat-list="toggleChatList"></Navigation>
  <div class="dialogs-wrapper">
    <transition name="fade">
      <ChatList
        v-if="isChatListVisible"
        @select-chat="handleChatSelect"
      ></ChatList>
    </transition>
    <Chat :chatId="selectedChatid"></Chat>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Chat from "./Chat.vue";
import ChatList from "./ChatList.vue";
import Navigation from "./Navigation.vue";

const isChatListVisible = ref(true);
const selectedChatid = ref(null);

const handleChatSelect = (chatId) => {
  selectedChatid.value = chatId;
};

const toggleChatList = () => {
  isChatListVisible.value = !isChatListVisible.value;
};

onMounted(() => {
  document.title = "Chatix";
});
</script>

<style scoped>
.dialogs-wrapper {
  display: flex;
  flex-direction: row;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.2s ease;
}
/* .fade-enter-from,
.fade-leave-to {
} */
</style>
