<template>
  <div class="login-container">
    <div class="login-wrapper">
      <h2>Welcome to Chatix!</h2>
      <form @submit.prevent="submitForm">
        <div class="input-group">
          <input type="text" v-model="username" placeholder="Username" />
        </div>

        <div class="input-group">
          <input type="password" v-model="password" placeholder="Password" />
        </div>

        <button type="submit" class="login-button">Login</button>
      </form>

      <div v-if="response" class="response">
        <h3>Response:</h3>
        <pre>{{ response }}</pre>

        <div v-if="response.message === 'ok'" class="user-data">
          <p><strong>ID:</strong> {{ response.id }}</p>
          <p><strong>Username:</strong> {{ response.username }}</p>
          <p><strong>Date of Birth:</strong> {{ response.dateOfBirth }}</p>
          <p><strong>Created At:</strong> {{ response.createdAt }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/authStore";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const response = ref(null);

const router = useRouter();

const submitForm = async () => {
  const payload = {
    username: username.value.trim(),
    password: password.value.trim(),
  };

  try {
    const res = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    response.value = data;

    if (data.message === "ok") {
      const authStore = useAuthStore();
      authStore.login(data);
      router.push("/chats");
    }
  } catch (error) {
    console.error("Error:", error);
    response.value = { error: error.message };
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background-color: rgb(75, 104, 104);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.login-button:hover {
  background-color: #0056b3;
}

.response {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.user-data {
  margin-top: 1rem;
}

.user-data p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}
</style>
