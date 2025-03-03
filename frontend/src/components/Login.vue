<template>
    <div class="container">
        <div class="wrapper">
            <h3>Welcome to Chatix!</h3>
            <form action="#" method="POST">
                <div class="input-wrapper">
                    <input 
                        type="text" 
                        v-model="username"
                        required 
                        placeholder="Username"
                        @input="validateUsername"
                        >

                        
                        <input 
                        type="password" 
                        v-model="password" 
                        required 
                        placeholder="Password"
                        @input="validatePassword"
                        >
                    </div>
                    
                <div class="errors">
                        <p v-if="usernameError" class="error">{{ usernameError }}</p>
                        <p v-if="passwordError" class="error">{{ passwordError }}</p>
                </div>
                <div class="options">
                    <div class="option-remember-me">
                        <input type="checkbox" id="remember" name="remember">
                        <p>Remember me</p>
                    </div>
                    <a href="#">Forgot password?</a>
                </div>

                <div class="buttons-wrapper">
                    <button class="submit-button">Login</button>
                    <button class="signup-button">I don't have an account</button>
                </div>
            </form>
        </div>
        
    </div>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('')
const password = ref('')
const usernameError = ref('')
const passwordError = ref('')

const validateUsername = () => {
    const regex = /^[a-zA-Z0-9]+$/;

    if (username.value === "") {
        usernameError.value = "";
        return;
    }

    if (username.value.length > 31) {
        usernameError.value = "Username must be 31 characters or less";
    } else if (!regex.test(username.value)) {
        usernameError.value = "Username contains invalid characters";
    } else {
        usernameError.value = "";
    }
}

const validatePassword = () => {
    const regex = /^[a-zA-Z0-9@#$%^&+=]+$/;
    
    if (password.value === "") {
        passwordError.value = "";
        return;
    }

    if (!regex.test(password.value)) {
        passwordError.value = "Password contains invalid characters";
    } else {
        passwordError.value = "";
    }
}


</script>

<style scoped>
.container {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.wrapper > h3 {
    font-size: 30px;
    color: white;
}

.wrapper {
    width: 500px;
    height: 500px;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 300px;
}

.input-wrapper > input {
    outline: none;
    border: none;
    height: 30px;
    border-radius: 30px;
    padding: 0 14px;
}

.errors {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: red;
    margin-top: 10px;
}

.option-remember-me {
    display: flex;
    flex-direction: row;
}

.option-remember-me > p {
    color: white;
}

.options {
    display: flex;
    justify-content: space-between;
    justify-items: center;
    margin: 10px 10px;
}

.options > a {
    font-size: 12px;
}

.buttons-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 30px;
}

.buttons-wrapper > button {
    height: 30px;
    outline: none;
    border: 2px solid white;
    color: white;
    border-radius: 10px;
    background: none;

    transition: 0.1s ease;
}

.buttons-wrapper > button:hover {
    transform: scale(102%);
}



</style>