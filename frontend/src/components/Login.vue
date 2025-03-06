<template>
  <div class="login-container">
    <div class="login-wrapper">
      <h2>Welcome to Chatix!</h2>
      <form @submit.prevent="submitForm">
        <div class="input-group">
          <i class="bx bx-user"></i>
          <input type="text" v-model="username" placeholder="Username" />
        </div>

        <div class="input-group">
          <i class="bx bxs-lock"></i>
          <input type="password" v-model="password" placeholder="Password" />
        </div>

        <button type="submit" class="login-button">Login</button>
        <button @click="goToSignUp" type="button" class="signup-button">
          Sign up
        </button>
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
    <div class="background-animation">
      <i class="bx bx-message-dots floating-icon size-1"></i>
      <i class="bx bx-chat floating-icon size-2"></i>
      <i class="bx bx-message-alt floating-icon size-3"></i>
      <i class="bx bx-message-dots floating-icon size-2"></i>
      <i class="bx bx-chat floating-icon size-1"></i>
      <i class="bx bx-message-alt floating-icon size-2"></i>
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

const goToSignUp = () => {
  router.push("/signup");
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background-color: #bfd1ff;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-wrapper {
  z-index: 1;
  background: rgba(255, 255, 255, 1);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 28px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  position: relative;
  margin-bottom: 1rem;
}

.input-group i {
  position: absolute;
  left: 1rem;
  top: 48%;
  transform: translateY(-50%);
  color: #888;
  font-size: 18px;
}

input {
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  border: 1px solid #ccc;
  border-radius: 20px;
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
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;

  transition: 0.2s ease;
}

.login-button:hover {
  background-color: #0056b3;
}

.signup-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  background-color: #b4b9be;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;

  transition: 0.2s ease;
}

.signup-button:hover {
  background-color: #5c5c5c;
  color: white;
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

.background-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  color: #647dcf;
  opacity: 0.6;
  animation: floatAnimation 10s infinite ease-in-out;
}

.size-1 {
  font-size: 5rem;
}

.size-2 {
  font-size: 6rem;
}

.size-3 {
  font-size: 7rem;
}

.floating-icon:nth-child(1) {
  top: 10%;
  left: 15%;
  animation-duration: 12s;
}

.floating-icon:nth-child(2) {
  top: 20%;
  left: 70%;
  animation-duration: 15s;
}

.floating-icon:nth-child(3) {
  top: 65%;
  left: 25%;
  animation-duration: 18s;
}

.floating-icon:nth-child(4) {
  top: 80%;
  left: 80%;
  animation-duration: 20s;
}

.floating-icon:nth-child(5) {
  top: 50%;
  left: 50%;
  animation-duration: 22s;
}

.floating-icon:nth-child(6) {
  top: 30%;
  left: 90%;
  animation-duration: 25s;
}

@keyframes floatAnimation {
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-30px) translateX(30px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}
</style>
