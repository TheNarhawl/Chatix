<template>
  <div class="container">
    <div class="left-container">
      <span @click="emit('toggle-chat-list')"
        ><i class="bx bx-dots-vertical"></i
      ></span>
      <div class="search-container">
        <i class="bx bx-search search-icon"></i>
        <input
          type="text"
          class="search-input"
          placeholder="Search users and messages..."
          @focus="isSearchFocused = true"
          @blur="onInputBlur"
          v-model="searchQuery"
        />
      </div>
    </div>
    <div class="right-container">
      <span><i class="bx bxs-bell"></i></span>
      <img src="/avatar.png" />
      <span @mouseenter="showAdditional" @mouseleave="startHideTimeout"
        ><i class="bx bxs-cog"></i
      ></span>
      <!-- <span @click="logout"><i class="bx bxs-exit"></i></span> -->
    </div>
    <transition name="dropdown">
      <div
        class="additional-wrapper"
        v-if="isAdditionalVisible"
        @mouseenter="clearHideTimeout"
        @mouseleave="startHideTimeout"
      >
        <ul>
          <li @click="isProfileOpen = true">Profile</li>
          <li>Settings</li>
          <li @click="logout" class="logout-button">
            Logout <i class="bx bx-log-out"></i>
          </li>
        </ul>
      </div>
    </transition>
  </div>
  <!-- <Profile @close-profile="isProfileOpen = false" /> -->
  <transition name="search-transition">
    <Search v-if="isSearchFocused || searchQuery" :query="searchQuery"/>
  </transition>
</template>

<script setup>
import Profile from "./Profile.vue";
import Search from "./Search.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { onBeforeUnmount, onMounted, ref } from "vue";

const router = useRouter();
const authStore = useAuthStore();
const emit = defineEmits(["toggle-chat-list"]);
const isProfileVisible = ref(false);

const isAdditionalVisible = ref(false);
const isProfileOpen = ref(false);
const isSearchFocused = ref(false);
const searchQuery = ref("");

const handleContainerClick = (event) => {
  const searchInput = event.target.closest('.search-container');
  const searchComponent = event.target.closest('.search-wrapper');

  if (!searchInput && !searchComponent) {
    isSearchFocused.value = false;
  }
};

const onInputBlur = () => {
  setTimeout(() => {
    if (!isSearchFocused.value) {
      isSearchFocused.value = false;
    }
  }, 200);
};

let hideTimeout = null;

const showAdditional = () => {
  clearTimeout(hideTimeout);
  isAdditionalVisible.value = true;
};

const startHideTimeout = () => {
  hideTimeout = setTimeout(() => {
    isAdditionalVisible.value = false;
  }, 300);
};

const clearHideTimeout = () => {
  clearTimeout(hideTimeout);
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};

onMounted(() => {
  document.addEventListener("click", handleContainerClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleContainerClick);
});
</script>

<style>
.container {
  background-color: #18172b;
  z-index: 1;
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.left-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  padding-left: 20px;

  font-size: 20px;
  color: #d1dbee;
}

.left-container > span,
.right-container > span {
  color: #5b5875;
  transition: 0.2s ease;
  cursor: pointer;
}

.left-container > span:hover,
.right-container > span:hover {
  color: #c44075;
}

.right-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding-right: 20px;
  font-size: 18px;

  color: #d1dbee;
}

.right-container > img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.search-container {
  position: relative;
  width: 400px;
}

.search-input {
  width: 100%;
  padding: 8px 8px 8px 40px;
  border: none;
  border-radius: 25px;
  background-color: #27243d;
  color: white;
  appearance: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
}

.search-input::placeholder {
  color: #cccccc;
}

.search-icon {
  position: absolute;
  font-size: 18px;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #cccccc;
  cursor: pointer;
}

.additional-wrapper {
  position: absolute;
  top: 7%;
  right: 1%;
  background: rgb(255, 255, 255);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 10px;
  min-width: 150px;
  z-index: 10;
}

.additional-wrapper ul {
  list-style: none;
  text-align: left;
  padding: 0;
  margin: 0;
}

.additional-wrapper li {
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background ease 0.2s;
}

.additional-wrapper li:hover {
  background: #f0f0f0;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 28px;
  color: red;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.dropdown-enter-from {
  transform: translateY(-5px);
  opacity: 0;
}

.dropdown-enter-to {
  transform: translateY(0px);
  opacity: 1;
}

.dropdown-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.dropdown-leave-to {
  opacity: 0;
}

.search-transition-enter-active,
.search-transition-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.search-transition-enter-from {
  opacity: 0;
}

.search-transition-enter-to {
  opacity: 1;
}

.search-transition-leave-from {
  opacity: 1;
}

.search-transition-leave-to {
  transform: translateY(8px);
  opacity: 0;
}

.search {
  position: absolute;
}
</style>
