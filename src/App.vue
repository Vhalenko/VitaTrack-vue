<script setup>
import { RouterView } from "vue-router";

</script>

<template>
  <div class="app">

    <main>
      <RouterView />
    </main>

  </div>
</template>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>