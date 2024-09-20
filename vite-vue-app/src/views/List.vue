<template>
  <!-- <button @click="sortContact()">Reorganiser</button> -->
    <b>Liste de contact</b>
    <p v-if="contacts.length == 0">Vous n'avez aucun contact !</p>
    <ul>
      <li v-if="sortedContacts" v-for="contact in sortedContacts" :key="contact.phone">
        <ContactComponent :pName="contact.name" :pPhone="contact.phone" :pId="contact.contactId"
          @supp="deleteContact(contact)" />
      </li>
    </ul>
    <RouterLink to="/add"> <button class="add">Ajouter un contact</button> </RouterLink> <br><br>
    <RouterLink to="/"> <button class="add">Retour</button> </RouterLink>
</template>

<script setup>

import { computed, ref, onMounted } from "vue"
import ContactComponent from "../components/Contact.vue"

const contacts = ref([])

async function getContacts() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:3000/get-contacts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(error);
    }
    const backContacts = await response.json();
    contacts.value = backContacts;
  } catch (error) { console.log(error); }
};

getContacts();

onMounted(() => {
  getContacts;
});

async function deleteContact(contact) {

  const token = localStorage.getItem('token');

  try {
    const newContactDel = {
      name: contact.name,
      phone: contact.phone,
      _id: contact.contactId
    };

    const response = await fetch("http://localhost:3000/rem-contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newContactDel)
    });

    if (!response.ok) {
      throw new Error("erreur!");
    }

    await getContacts();
  } catch (error) { console.log(error); }
};

const sortedContacts = computed(() => {
  return contacts.value.toSorted((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: 'base' }));
})

</script>

<style scoped>
* {
  font-family: "Segoe UI";
}

ul{
  width: 450px;
  padding: 0px;
}

.add {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 7px 7px;
  border: 1px solid black;
}

.add:hover {
  background-color: #d4d4d4;
  transition-duration: 0.3s;
}

</style>