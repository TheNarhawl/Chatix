<template>
    <div class="container">
        <div class="upper-buttons">
            <div class="btns-container">
                <p
                    v-for="tab in tabs"
                    :key="tab"
                    :class="{ active: selectedTab === tab }"
                    @click="selectTab(tab)"
                >
                {{ tab }}
            </p>
        </div>
            <div class="create-new-message-button">
                <span><i class='bx bx-plus' ></i></span>
            </div>
            
        </div>

        <transition name="fade" mode="out-in">
            <!-- Recent -->
            <div v-if="selectedTab === 'Recent'" class="dialogs-container">
                <ul>
                    <li
                        v-for="(dialog, index) in dialogs"
                        :key="index"
                        class="dialog-wrap"
                    >
                        <img :src="dialog.avatar" alt="Avatar" class="avatar">
                        <span :class="['status', dialog.status]"></span>
                        <div class="dialog-info">
                            <p class="nickname">{{ dialog.nickname }}</p>
                            <p class="message-preview">{{ dialog.messagePreview }}</p>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Contacts -->
            <div v-else-if="selectedTab === 'Contacts'" class="dialogs-container">
                <ul>
                    <li
                        v-for="(contact, index) in contacts"
                        :key="index"
                        class="contact-wrap"
                    >
                        <img :src="contact.avatar" alt="Avatar" class="avatar">
                        <span :class="['status', contact.status]"></span>
                        <div class="contact-info">
                            <p class="nickname">{{ contact.nickname }}</p>
                            <p class="last-seen">{{ contact.lastSeen }}</p>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Groups -->
            <div v-else-if="selectedTab === 'Groups'" class="dialogs-container">
                <ul>
                    <li
                        v-for="(group, index) in groups"
                        :key="index"
                        class="group-wrap"
                    >
                        <img :src="group.avatar" alt="Group Avatar" class="avatar">
                        <div class="group-info">
                            <p class="group-name">{{ group.name }}</p>
                            <p class="members-count">{{ group.membersCount }} members</p>
                        </div>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const selectedTab = ref('Contacts');
const tabs = ['Recent', 'Contacts', 'Groups'];

const dialogs = ref([
    {
        avatar: '/avatar.png',
        status: 'online',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
    {
        avatar: '/avatar.png',
        status: 'offline',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
    {
        avatar: '/avatar.png',
        status: 'online',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
    {
        avatar: '/avatar.png',
        status: 'offline',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
    {
        avatar: '/avatar.png',
        status: 'offline',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
    {
        avatar: '/avatar.png',
        status: 'offline',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
    {
        avatar: '/avatar.png',
        status: 'offline',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
    {
        avatar: '/avatar.png',
        status: 'offline',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
    {
        avatar: '/avatar.png',
        status: 'offline',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
    {
        avatar: '/avatar.png',
        status: 'offline',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
    {
        avatar: '/avatar.png',
        status: 'offline',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
    {
        avatar: '/avatar.png',
        status: 'offline',
        nickname: 'Narhawl',
        messagePreview: 'Lorem ipsum',
    },
]);

const contacts = ref([
    {
        avatar: '/avatar.png',
        status: 'online',
        nickname: 'Narhawl',
        lastSeen: 'Last seen 2 hours ago',
    },
]);

const groups = ref([
    {
        avatar: '/public-avatar.png',
        name: 'Стеклодувы Архангельск',
        membersCount: 24,
    }
]);

const selectTab = (tab) => {
    selectedTab.value = tab;
};

</script>

<style scoped>
.container {
    z-index: 100;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);
    width: 340px;
    background-color: #f5f5f5;
    box-shadow: 0px 4px 4px rgb(0, 0, 0, 0.1);

}

.upper-buttons {
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 40px;
    padding: 0px 10px;
}

.btns-container {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 8px;
}

.btns-container > p {
    cursor: pointer;
    color: black;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    padding-bottom: 5px;
    transition: color 0.1s ease;
}

.btns-container > p.active {
    color: #3399ff;
}

.btns-container > p.active::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: #3399ff;
}

.create-new-message-button {
    cursor: pointer;
    font-size: 20px;
    color: #979797;
}

.dialogs-container {
    width: 100%;
    max-height: 100%;
    min-height: 0;
    flex-grow: 1;
    overflow-y: auto;
    background-color: #f5f5f5;
}

/* Стилизация ползунка для WebKit-браузеров (Chrome, Safari, Edge) */
.dialogs-container::-webkit-scrollbar {
    width: 6px;
}

.dialogs-container::-webkit-scrollbar-track {
    background-color: #d3d3d3;
    border-radius: 10px;
}

.dialogs-container::-webkit-scrollbar-thumb {
    background-color: #b3d7f4;
    border-radius: 10px;
    border: none;
}

.dialogs-container::-webkit-scrollbar-thumb:hover {
    background-color: #3399ff;
}

/* Для Firefox */
/* .dialogs-container {
    scrollbar-width: thin;
    scrollbar-color: #3399ff #b3d7f4; 
} */

ul {
    list-style: none;
    padding: 0;
    margin: 0;
    min-height: 0;
}

.dialog-wrap, 
.contact-wrap, 
.group-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    background-color: white;
    padding: 15px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid #ddd;
    position: relative;
}

.dialog-wrap:last-child, 
.contact-wrap:last-child, 
.group-wrap:last-child {
    border-bottom: none;
}

.dialog-wrap:hover, 
.contact-wrap:hover, 
.group-wrap:hover {
    background-color: #f0f0f0;
}

.avatar-wrapper {
    position: relative;
    width: 50px;
    height: 50px;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.status {
    position: absolute;
    bottom: 16px;
    right: 220px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
}

.online {
    background-color: #4caf50;
}

.offline {
    background-color: #ccc;
}

.dialog-info {
    display: flex;
    flex-direction: column;
}

.nickname, .group-name {
    font-weight: 600;
    font-size: 14px;
}

.message-preview, 
.last-seen, 
.members-count {
    color: gray;
    font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}

</style>