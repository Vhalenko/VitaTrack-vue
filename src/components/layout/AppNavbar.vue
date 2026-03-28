<template>
  <nav class="navbar">
    <RouterLink to="/dashboard">Dashboard</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/register">Register</RouterLink>
  </nav>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  name: "AppNavbar",
  components: {
    RouterLink
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  gap: 20px;
}

a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  opacity: 0.8;
}

.router-link-active {
  font-weight: bold;
}
</style>