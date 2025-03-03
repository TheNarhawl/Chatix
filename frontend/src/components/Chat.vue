<template>
    <div class="container">
        <div class="dialog-info">
            <div class="user-info">
                <img :src="user.avatar" alt="User Avatar" class="avatar">
                <div class="user-wrapper">
                    <p>Narhawl</p>
                    <span class="status" :class="{ 'online': user.isOnline, 'offline': !user.isOnline }">
                    {{ user.isOnline ? 'В сети' : 'Не в сети' }}
                    </span>
                </div>
                
            </div>
            <div class="actions">
                <span><i class='bx bx-search-alt-2'></i></span>
                <span><i class='bx bx-user-plus'></i></span>
                <span><i class='bx bx-dots-vertical'></i></span>
            </div>
        </div>
        <div class="chat-window">
            <ul class="message-list">
                <li
                    v-for="(message, index) in messages"
                    :key="index"
                    :class="['message', message.sender === 'user' ? 'user-message' : 'other-message']"
                >
                    <!-- Аватарка и имя собеседника -->
                    <div v-if="message.sender === 'other'" class="message-info">
                        <img :src="message.avatar" alt="Avatar" class="avatar">
                        <span class="username">{{ message.username }}</span>
                        <span v-if="message.sender != 'user'" class="message-time">{{ message.time }}</span>
                    </div>

                    <!-- Текст сообщения -->
                    <div class="message-content">
                        <p class="message-text">{{ message.text }}</p>
                        <span v-if="message.sender === 'user'" class="message-time">{{ message.time }}</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="input-area">
            <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Введите сообщение..." class="message-input">
            <button class="file-btn"><span><i class='bx bx-paperclip' ></i></span></button>
            <button class="emoji-btn"><span><i class='bx bx-face'></i></span></button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const user = ref({
    avatar: '/avatar.png',
    isOnline: true,
});

const messages = ref([
    {
        text: 'привет, сайтецкий верстаешь?',
        sender: 'other',
        avatar: '/avatar.png',
        username: 'Narhawl',
        time: '10:00',
    },
    {
        text: 'да........',
        sender: 'user',
        time: '10:01',
    }
]);

const newMessage = ref('');

const sendMessage = () => {
    if (newMessage.value.trim() !== '') {
        messages.value.push({
            text: newMessage.value.trim(),
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        newMessage.value = '';
    }
};
</script>

<style scoped>
.container {
    width: 100vw;
    height: calc(100vh - 60px);
    background-color: aquamarine;
    display: flex;
    flex-direction: column;
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

.emoji-btn, .file-btn {
    border: none;
    cursor: pointer;
    margin-left: 5px;
    border: none;
    padding: 10px;
    font-size: 20px;
    color: #666
}

.file-btn > span > i {
    transform: rotate(-45deg);
}
</style>