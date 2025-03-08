<template>
  <div class="profile-container">
    <div class="upper-container">
      <h2>Profile</h2>
      <span @click="emit('closeProfile')"><i class="bx bx-x"></i></span>
    </div>
    <div class="user-container">
      <span class="avatar-span">
        <img :src="safeAvatarURL" alt="Avatar" />
      </span>
      <div class="info-container">
        <ul>
          <li>{{ safeUsername }}<i class="bx bxs-pencil"></i></li>
        </ul>
      </div>
    </div>
    <div class="bio-wrapper">
      <h3>Bio <i class="bx bxs-pencil"></i></h3>
      <p>{{safeBio}}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits, onMounted, ref } from "vue";
import { useAuthStore } from "@/store/authStore";

const emit = defineEmits(["closeProfile"]);
const user = ref(null);
const errorMessage = ref("");
const authStore = useAuthStore();
const userId = authStore.user?.id;

const safeAvatarURL = computed(() => user.value?.avatarURL || "no-avatar.png");
const safeBio = computed(() => user.value?.bio || "No bio available");
const safeUsername = computed(() => user.value?.username || "Unknown User");

const fetchUserData = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/user/get-info?userId=${userId}`
    );
    const data = await response.json();

    if (response.ok) {
      user.value = data.data;
    } else {
      errorMessage.value = data.error || "User not found";
    }
  } catch (error) {
    errorMessage.value = "Ошибка загрузки данных";
    console.error("Ошибка:", error);
  }
};

onMounted(fetchUserData);
</script>

<style scoped>
.profile-container {
  z-index: 11;
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 580px;
  width: 420px;
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 20px;
  left: 38%;
  top: 10%;
  gap: 20px;
}

.upper-container {
  background-color: aquamarine;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.upper-container > h2 {
  flex-grow: 1;
  font-size: 18px;
}

.upper-container > span > i {
  font-size: 20px;
}

.user-container {
  display: flex;
  flex-direction: row;
  gap: 40px;
  background-color: bisque;
}

.avatar-span {
  width: 80px;
  height: 80px;
}

.avatar-span > img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.bio-wrapper {
  background-color: bisque;
  word-wrap: break-word;
  white-space: normal;
}
</style>
