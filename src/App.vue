<template>
  <nav id="navbar">
    <ul classid="right-links">
      <li>
        <router-link active-class="active" to="/">Home</router-link>
      </li>
    </ul>
    <ul id="left-links">
      <li>
        <router-link active-class="active" to="/login">Login</router-link>
      </li>
      <li>
        <router-link active-class="active" to="/register">Register</router-link>
      </li>
    </ul>
  </nav>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.container {
  margin-left: 4rem;
  margin-right: 4rem;
}

#navbar {
  width: 100%;
  background-color: navy;
  display: flex;
  justify-content: space-between;
}

ul {
  list-style: none;
  display: flex;
  padding-left: 1rem;
}

#left-links {
  padding-right: 2rem;
}

a {
  text-decoration: none;
  color: grey;
  padding: 1rem;
}

a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

a.active {
  color: white;
}
</style>
