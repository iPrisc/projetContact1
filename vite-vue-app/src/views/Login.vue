<template>
    <b>Se connecter</b>
    <form @submit.prevent="onLogin()">
        <svg class="logoName" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
        <input type="text" placeholder="Nom" v-model="loginName"><br>
        <svg class="logoPwd" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg>
        <input type="password" placeholder="Mot de passe" v-model="loginPwd"><br>
        <button class="login" :disabled="loginName.length == 0 || loginPwd.length == 0">Se connecter</button>
    </form>
    <div v-if="msg"> {{msg}}</div>
    <p> Vous avez n'avez pas encore de compte : </p>
    <RouterLink to="/signup"> <button class="signup">S'inscrire</button> </RouterLink>
</template>

<script setup>
import { ref, computed } from "vue"
import { useStore } from "vuex"
import signUpValidation from "../services/signUpValidation"
import { LOGIN_ACTION } from "../store/storeConstants";
import { useRouter } from 'vue-router'

const loginName = ref("")
const loginPwd = ref("")
let msg = ref("")
const store = useStore();
const router = useRouter();

function onLogin() {

  store.dispatch(LOGIN_ACTION, {
        name: loginName.value,
        password: loginPwd.value,
  }).then((response) => {
    if (response.statut === 0) {
        msg.value = response.error;
        loginName.value = "";
        loginPwd.value = "";
    } else {
        msg.value = "";
        router.push("/list");
    }  });

  loginName.value = "";
  loginPwd.value = "";

}
</script>

<style scoped>
* {
  font-family: "Segoe UI";
}

form{
  padding: 5px;
  margin: 5px 0;
}

.login {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 7px 15px;
  border: 1px solid black;
  margin: 5px 0 0 18px;
}

.login:hover {
  background-color: #d4d4d4;
  transition-duration: 0.3s;
}

.login:disabled {
  cursor: not-allowed;
  background-color: #f0f0f0;
  border-color: #cccccc;
}

.signup {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 7px 15px;
  border: 1px solid black;
}

input{
  margin: 5px;
  padding: 5px;
}

.logoName, .logoPwd{
  width: 13px;
  height: 13px;
}

</style>