<template>
  <nav-bar />
  <notifications />
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Notifications from './components/Notifications.vue'
</script>

<style>
.container {
  margin-left: 4rem;
  margin-right: 4rem;
}

.text-left {
  text-align: start
}

.text-right {
  text-align: end;
}

.text-center {
  text-align: center;
}

.dark-background {
  background-color: #512483;
}

.dim-background {
  background-color: rgb(200, 140, 255);
}

.light-background {
  background-color: rgb(230, 200, 255);
}

h1 {
  text-transform: uppercase;
  text-align: center;
}

th {
  text-align: start;
  padding: 5px;
}

.btn {
  font: inherit;
  text-decoration: none;
  border: 2px solid #512483;
  color: white;
  background-color: #512483;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 0.5rem;
}

.btn:hover {
  box-shadow: none;
  border: 2px solid black;
}

.btn-danger {
  background-color: red;
  border: 2px solid red;
}
</style>
