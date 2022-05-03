<template>

  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/hello">Hello</router-link>
          </li>
        </ul>
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/login">Login</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container">
    <router-view></router-view>
  </div>
</template>
