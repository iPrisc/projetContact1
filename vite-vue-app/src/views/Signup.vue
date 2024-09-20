<template>
    <b>S'inscrire</b>
    <form @submit.prevent="onSignup()">
        <svg class="logoName" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
        <input type="text" placeholder="Nom" v-model="signUpName"><br>
        <svg class="logoPwd" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg>
        <input type="password" placeholder="Mot de passe" v-model="signUpPwd"><br>
        <button class="signup" :disabled="signUpName.length == 0 || signUpPwd.length == 0">S'inscrire</button>
    </form>
    <div v-if="errors.name"> {{errors.name}}</div> 
    <div v-if="errors.password"> {{errors.password}}</div>
    <div v-if="msg"> {{msg}}</div>
    <!-- <div class="errors" v-if="errors.password"> {{errors.password}}</div>  -->
    <p> Vous avez déjà un compte : </p>
    <RouterLink to="/login"> <button class="login">Se connecter</button> </RouterLink>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import signUpValidation from "../services/signUpValidation";
import { SIGNUP_ACTION } from "../store/storeConstants";
import { useRouter } from 'vue-router'

const store = useStore();
const signUpName = ref("")
const signUpPwd = ref("")
let msg = ref("")

let errors = ref([])
const router = useRouter();

function onSignup() {
  let validation = new signUpValidation(signUpName.value, signUpPwd.value)
  errors.value = validation.checkValidation();
  if("name" in errors || "password" in errors){
    return false;
  }

  store.dispatch(SIGNUP_ACTION, {
        name: signUpName.value,
        password: signUpPwd.value,
  }).then((response) => {
    // msg.value = response.statut == 0 ? "Ce nom existe deja." : ""
    if (response.statut === 0) {
        msg.value = "Ce nom existe déjà.";
        signUpName.value = "";
        signUpPwd.value = "";
    } else {
        msg.value = "";
        router.push("/");
    }

  });
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

.signup {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 7px 15px;
  border: 1px solid black;
  margin: 5px 0 0 18px;
}

.signup:hover {
  background-color: #d4d4d4;
  transition-duration: 0.3s;
}

.signup:disabled {
  cursor: not-allowed;
  background-color: #f0f0f0;
  border-color: #cccccc;
}

.login {
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