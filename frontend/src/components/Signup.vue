<template>
  <div class="login-container">
    <div class="login-wrapper">
      <h2 v-if="!isSuccess">Create a new Chatix account</h2>

      <div v-if="isSuccess" class="success-message">
        <h2>Account successfully created!</h2>
        <button @click="goToLogin" class="go-to-login-button">Login</button>
      </div>

      <form v-else @submit.prevent="submitForm">
        <div class="input-group" :class="{ 'input-error': usernameError }">
          <i class="bx bx-user"></i>
          <input type="text" v-model="username" placeholder="Enter username" />
        </div>

        <div class="input-group" :class="{ 'input-error': dateError }">
          <i class="bx bx-calendar"></i>
          <input type="date" v-model="dateOfBirth" />
        </div>

        <div class="input-group" :class="{ 'input-error': passwordError }">
          <i class="bx bxs-lock"></i>
          <input
            type="password"
            v-model="password"
            placeholder="Enter password"
          />
        </div>

        <div class="input-group" :class="{ 'input-error': passwordError }">
          <i class="bx bxs-arrow-from-left"></i>
          <input
            type="password"
            v-model="repeatPassword"
            placeholder="Repeat password"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="signup-button" :disabled="!!errorMessage">
          Create account
        </button>
        <button @click="goToLogin" class="go-to-login-button">
          I already have an account
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const dateOfBirth = ref("");
const password = ref("");
const repeatPassword = ref("");
const response = ref(null);
const isSuccess = ref(false);

const router = useRouter();

const usernamePattern = /^[A-Za-z0-9_#$@]+$/;
const passwordPattern = /^[A-Za-z0-9_#$@]+$/;

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const usernameError = computed(() => {
  return (
    username.value.length < 4 ||
    username.value.length > 30 ||
    !usernamePattern.test(username.value)
  );
});

const dateError = computed(() => {
  return !dateOfBirth.value || calculateAge(dateOfBirth.value) < 18;
});

const passwordError = computed(() => {
  return (
    password.value.length > 30 ||
    !passwordPattern.test(password.value) ||
    password.value !== repeatPassword.value
  );
});

const errorMessage = computed(() => {
  if (usernameError.value) {
    return "Invalid username: must be 4-30 characters and contain only A-Z, a-z, 0-9, #, $, @, _.";
  }
  if (dateError.value) {
    return "You must be at least 18 years old to register.";
  }
  if (passwordError.value) {
    return "Invalid password: must be at most 30 characters, contain only allowed characters, and match repeat password.";
  }
  return "";
});

const submitForm = async () => {
  if (errorMessage.value) {
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        dateOfBirth: dateOfBirth.value,
      }),
    });
    response.value = await res.json();
    if (response.value.message === "ok") {
      isSuccess.value = true;
    }
  } catch (error) {
    response.value = { message: "Error occurred" };
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background-color: rgb(152, 153, 155);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.input-error {
  border-color: red !important;
}

.error-message {
  color: red;
  text-align: center;
  font-size: 14px;
  margin-bottom: 1rem;
}

.signup-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;
}

.go-to-login-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  background-color: #b4b9be;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;
}

.success-message > .go-to-login-button {
    background-color: #007bff;
    color: white;
}

.success-message > .go-to-login-button:hover {
    background-color: #0056b3;
}

.signup-button:hover {
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
