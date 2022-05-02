<template>
  <div class="container">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/hello">Hello</router-link></li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
