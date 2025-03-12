<template>
  <div class="container">
    <div v-if="!chatData" class="wrapper">
      <p>Welcome to Chatix!</p>
    </div>
    <div v-else class="dialog-info">
      <div class="user-info">
        <img src="no-avatar.png" alt="User Avatar" class="avatar" />
        <div class="user-wrapper">
          <p>{{ interlocutor.username }}</p>
          <!-- <span
            class="status"
            :class="{ online: user.isOnline, offline: !user.isOnline }"
          >
            {{ user.isOnline ? "В сети" : "Не в сети" }}
          </span> -->
        </div>
      </div>
      <div class="actions">
        <span><i class="bx bx-search-alt-2"></i></span>
        <span><i class="bx bx-user-plus"></i></span>
        <span><i class="bx bx-dots-vertical"></i></span>
      </div>

      <div class="chat-window">
        <ul class="message-list">
          <li
            v-for="(message, index) in chatData.messages"
            :key="index"
            :class="[
              'message',
              message.sender.id === userId ? 'user-message' : 'other-message',
            ]"
          >
            <!-- Аватарка и имя собеседника -->
            <div v-if="message.sender.id !== userId" class="message-info">
              <img :src="interlocutor.avatarURL" alt="Avatar" class="avatar" />
              <span class="username">{{ interlocutor.username }}</span>
              <span class="message-time">{{
                formatTimestamp(message.timestamp)
              }}</span>
            </div>

            <!-- Текст сообщения -->
            <div class="message-content">
              <p class="message-text">{{ message.text }}</p>
              <span v-if="message.sender.id === userId" class="message-time">
                {{ formatTimestamp(message.timestamp) }}
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="input-area">
        <input
          type="text"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Введите сообщение..."
          class="message-input"
        />
        <button class="file-btn">
          <span><i class="bx bx-paperclip"></i></span>
        </button>
        <button class="emoji-btn">
          <span><i class="bx bx-face"></i></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, computed } from "vue";
import { useAuthStore } from "@/store/authStore";
const authStore = useAuthStore();

const props = defineProps({
  chatId: {
    type: String,
    default: null,
  },
});

const localChatId = ref(props.chatId);
const chatData = ref(null);
const userId = computed(() => authStore.userId);

const interlocutor = computed(() => {
  if (!chatData.value) return null;
  return chatData.value.users.find((user) => user.id !== userId.value);
});

const fetchChatData = async (chatId) => {
  try {
    const url = `http://localhost:3000/chat/get-messages?chatId=${chatId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    chatData.value = data;
    console.log("Chat data:", data);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    chatData.value = null;
  }
};

watch(
  () => props.chatId,
  (newChatId) => {
    localChatId.value = newChatId;
    if (newChatId) {
      fetchChatData(newChatId);
      console.log(chatData);
    } else {
      chatData.value = null;
    }
  },
  { immediate: true }
);

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
.container {
  width: 100vw;
  height: calc(100vh - 60px);
  background-color: white;
  display: flex;
  flex-direction: column;
}

.wrapper > p {
  height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-self: center;
  align-items: center;
  background-color: white;
  color: #d5d5d5;
}

.dialog-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-wrapper {
  display: flex;
  flex-direction: column;
}

.status {
  font-size: 14px;
  color: #666;
}

.status.online {
  color: green;
}

.status.offline {
  color: red;
}

.actions {
  font-size: 20px;
  display: flex;
  gap: 20px;
  color: #666;
}

.chat-window {
  width: 100%;
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: white;
}

.message-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

/* Сообщения пользователя (справа) */
.user-message {
  align-self: flex-end;
  background-color: #3399ff;
  color: white;
  border-radius: 10px 10px 0 10px;
  padding: 10px;
}

/* Сообщения собеседника (слева) */
.other-message {
  align-self: flex-start;
  background-color: #e0f2ff; /* Голубой цвет */
  color: black;
  border-radius: 10px 10px 10px 0;
  padding: 10px;
}

/* Аватарка и имя собеседника */
.message-info {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.username {
  flex-grow: 1;
  font-weight: bold;
  font-size: 14px;
}

/* Контейнер для текста сообщения и времени */
.other-message > .message-content {
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  gap: 5px;
}

.message-text {
  max-width: 240px;
  padding-right: 20px;
  margin: 0;
  font-size: 14px;
}

.message-time {
  font-size: 12px;
  color: #666;
}

.user-message > .message-content > .message-time {
  align-self: flex-end;
  color: rgb(255, 255, 255);
}

.input-area {
  display: flex;
  padding: 10px;
  width: 100%;
  background-color: #f0f0f0;
  border-top: 1px solid #ccc; /* Полоска сверху для разграничения */
}

.message-input {
  flex: 1;
  padding: 10px;
  border: none; /* Убираем обводку */
  border-radius: 5px;
  margin-right: 10px;
  background-color: transparent; /* Прозрачный фон */
  outline: none; /* Убираем outline при фокусе */
  font-size: 16px; /* Размер текста */
}

.message-input::placeholder {
  color: #999; /* Цвет плейсхолдера */
}

.emoji-btn,
.file-btn {
  border: none;
  cursor: pointer;
  margin-left: 5px;
  border: none;
  padding: 10px;
  font-size: 20px;
  color: #666;
}

.file-btn > span > i {
  transform: rotate(-45deg);
}
</style>
