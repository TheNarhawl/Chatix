<template>
  <div class="search-wrapper">
    <div class="search-by-container">
      <span>Search by:</span>
      <div class="mode-buttons-container">
        <span
          :class="{ active: searchMode === 'users' }"
          @click="searchMode = 'users'"
          >Users</span
        >
        <span
          :class="{ active: searchMode === 'messages' }"
          @click="searchMode = 'messages'"
          >Messages</span
        >
      </div>
    </div>
    <div class="search-results" v-if="results.length > 0">
      <ul>
        <li v-for="user in results" :key="user.id" class="search-item">
          <img
            :src="user.avatarURL || 'no-avatar.jpg'"
            alt="User Avatar"
            class="avatar"
          />
          <span class="username">{{ user.username }}</span>
          <div class="icon-container">
            <span class="icon"><i class="bx bxs-user-plus"></i></span>
            <span class="icon" @click="startChat(user.username)">
              <i class="bx bx-message-rounded"></i>
            </span>
          </div>
        </li>
      </ul>
    </div>
    <div v-else-if="loading">Loading...</div>
    <div v-else>No results found</div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from 'vue-router';

const props = defineProps({
  query: {
    type: String,
    required: true,
  },
});

const results = ref([]);
const loading = ref(false);
const authStore = useAuthStore();
const searchMode = ref("users");

watch(
  () => props.query,
  async (newQuery) => {
    if (newQuery.trim() === "") {
      results.value = [];
      return;
    }

    loading.value = true;

    try {
      const response = await fetch(
        `http://localhost:3000/user/search?prompt=${encodeURIComponent(
          newQuery
        )}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      results.value = data.data || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      results.value = [];
    } finally {
      loading.value = false;
    }
  }
);

const startChat = async (getterUsername) => {
  const senderUsername = authStore.user.username;

  if (!senderUsername || !getterUsername) {
    alert("Sender or getter username is missing.");
    return;
  }

  try {
    const requestBody = JSON.stringify({
      senderUsername,
      getterUsername
    });

    console.log("Request body:", requestBody);

    const createResponse = await fetch('http://localhost:3000/chat/create-dm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: requestBody
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error("Server error response:", errorData);
      throw new Error(`Error creating DM: ${errorData.error || createResponse.statusText}`);
    }

    const createData = await createResponse.json();
    console.log("DM chat created successfully with ID:", createData.chatId);

  } catch (error) {
    console.error("Error:", error);
    alert("Failed to create DM chat. Please try again.");
  }
};
</script>

<style scoped>
.search-wrapper {
  z-index: 100;
  position: absolute;
  left: 60px;
  min-height: 120px;
  width: 400px;
  background-color: #ffffff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.search-by-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-by-container > span {
  font-size: 16px;
  margin-right: 10px;
}

.mode-buttons-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mode-buttons-container > span {
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 16px;
  background-color: #343553;
  color: white;
}

.mode-buttons-container > span.active {
  background-color: #f83f5f;
}

.search-results {
  flex-grow: 1;
}

.search-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  transition: background-color 0.2s;
}

.search-item:hover {
  background-color: #f7f7f7;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  font-size: 16px;
  color: #333;
}

.icon-container {
  display: flex;
  gap: 10px;
}

.icon {
  cursor: pointer;
  transition: color 0.2s;
}

.icon:hover {
  color: #c44075;
}
</style>
