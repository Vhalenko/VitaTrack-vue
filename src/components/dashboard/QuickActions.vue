<template>
  <div class="card">
    <h2>Quick Actions</h2>

    <div class="actions">
      <router-link to="/food-log" class="btn">
        Add Food
      </router-link>

      <router-link to="/history" class="btn">
        View History
      </router-link>

      <router-link to="/profile" class="btn">
        Set Goals
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuickActions"
};
</script>

<style scoped>
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  background: #42b883;
  color: white;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  text-decoration: none;
}

.btn:hover {
  opacity: 0.9;
}
</style>