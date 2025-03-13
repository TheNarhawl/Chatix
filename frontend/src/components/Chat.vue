<template>
  <div class="container">
    <div v-if="!chatData" class="wrapper">
      <p>Welcome to Chatix!</p>
    </div>
    <div v-else class="dialog">
      <div class="user-info">
        <div class="user-wrapper">
          <img
            :src="interlocutor.avatarURL || 'no-avatar.jpg'"
            alt="User Avatar"
            class="avatar"
          />
          <p>{{ interlocutor.username }}</p>
        </div>
        <div class="actions">
          <span><i class="bx bx-search-alt-2"></i></span>
          <span><i class="bx bx-user-plus"></i></span>
          <span><i class="bx bx-dots-vertical"></i></span>
        </div>
      </div>

      <div class="chat-window" ref="chatContainer">
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
              <img
                :src="interlocutor.avatarURL || 'no-avatar.jpg'"
                alt="Avatar"
                class="message-avatar"
              />
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
        <textarea
          v-model="newMessage"
          @keydown="handleKeydown"
          placeholder="Write a message..."
          class="message-input"
          :style="{ height: inputHeight }"
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
import { ref, defineProps, watch, computed, nextTick } from "vue";
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
const userId = authStore.user?.id;

const interlocutor = computed(() => {
  if (!chatData.value) return null;
  return chatData.value.users.find((user) => user.id !== userId);
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
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    chatData.value = null;
  }
};

const newMessage = ref("");
const inputHeight = ref("40px");

const handleKeydown = (event) => {
  if (event.key === "Enter" && event.shiftKey) {
    return;
  } else if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }

  adjustHeight(event.target);
};

const adjustHeight = (element) => {
  const maxHeight = 120;
  element.style.height = "auto";

  const scrollHeight = element.scrollHeight;

  inputHeight.value = Math.min(scrollHeight, maxHeight) + "px";
};

async function sendMessage() {
  if (!newMessage.value.trim()) {
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/chat/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: localChatId.value,
        senderId: userId,
        text: newMessage.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка при отправке сообщения");
    }

    newMessage.value = "";
    inputHeight.value = "40px";

    fetchChatData(localChatId.value);
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

const chatContainer = ref(null);
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
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
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
</script>

<style scoped>
.container {
  width: 100vw;
  height: calc(100vh - 60px);
  /* background-color: white; */
  background-color: #110e21;
  display: flex;
  flex-direction: column;
}

.wrapper > p {
  height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-self: center;
  align-items: center;
  background-color: #110e21;
  color: grey;
}

.dialog {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 100%;
  background-color: #1d1b34;
}

.user-info {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}

.user-wrapper {
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-grow: 1;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

/* .status {
  font-size: 14px;
  color: #666;
}

.status.online {
  color: green;
}

.status.offline {
  color: red;
} */

.actions {
  font-size: 20px;
  display: flex;
  gap: 16px;
  color: #969696;
}

.actions > span {
  cursor: pointer;
  transition: 0.2s ease;
}

.actions > span:hover {
  color: #ff4c65;
}

.chat-window {
  width: 100%;
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #110e21;
  flex-direction: column;
}

.message-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 1;
  justify-content: flex-end;
  gap: 15px;
}

.message {
  max-width: 80%;
  display: flex;
  flex-direction: column;
}

.user-message {
  align-self: flex-end;
  background-color: #29273f;
  color: rgb(255, 255, 255);
  border-radius: 10px 10px 0 10px;
  padding: 10px;
}

.other-message {
  align-self: flex-start;
  background-color: #1a1833;
  color: rgb(255, 255, 255);
  border-radius: 10px 10px 10px 0;
  padding: 10px;
}

.message-info {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  gap: 10px;
}

.message-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.username {
  flex-grow: 1;
  font-weight: bold;
  font-size: 14px;
}

.other-message > .message-content {
  display: flex;
  flex-direction: column;
  margin-left: 40px;
}

.message-text {
  max-width: 300px;
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
  color: rgb(100, 100, 100);
}

.input-area {
  height: 160px;
  display: flex;
  padding: 10px;
  width: 100%;
  background-color: #18172b;
  border-top: 1px solid #1e1d23;
}

.message-input {
  align-items: center;
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  background-color: transparent;
  outline: none;
  font-size: 16px;
  resize: none;
  overflow-y: auto;
  max-height: 120px;
  line-height: 1.5;
  color: #d5d5d5;
}

.message-input::placeholder {
  color: #999;
}

.message-input::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.emoji-btn,
.file-btn {
  border: none;
  margin-left: 5px;
  border: none;
  padding: 10px;
  font-size: 20px;
  color: #666;
  background-color: #18172b;
}

.emoji-btn > span,
.file-btn > span {
  cursor: pointer;
  transition: 0.2s ease;
}

.emoji-btn > span:hover,
.file-btn > span:hover {
  color: #ff4c65;
}

.file-btn > span > i {
  transform: rotate(-45deg);
}

.chat-window::-webkit-scrollbar {
  width: 6px;
}

.chat-window::-webkit-scrollbar-track {
  background-color: none;
  border-radius: 10px;
}

.chat-window::-webkit-scrollbar-thumb {
  background-color: #1d1b34;
  border-radius: 10px;
  border: none;
}

.chat-window::-webkit-scrollbar-thumb:hover {
  background-color: #27243d;
}
</style>
