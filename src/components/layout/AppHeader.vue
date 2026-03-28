<template>
  <header class="header">
    <div class="header-container">
      <h1 class="logo">Calorie Tracker</h1>
      <AppNavbar />
    </div>
  </header>
</template>

<script>
import AppNavbar from "./AppNavbar.vue";

export default {
  name: "AppHeader",
  components: {
    AppNavbar
  }
};
</script>

<style scoped>
.header {
  background-color: #42b883;
  color: white;
  padding: 15px 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 600;
}
</style>