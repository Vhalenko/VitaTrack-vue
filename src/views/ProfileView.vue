<template>
  <div class="profile-page">
    <h1>Profile</h1>
    <ProfileForm @update-profile="handleUpdateProfile" />
  </div>
</template>

<script>
import ProfileForm from "@/components/profile/ProfileForm.vue";

export default {
  name: "ProfileView",
  components: {
    ProfileForm
  },
  methods: {
    handleUpdateProfile(data) {
      console.log("Updated profile:", data);
      // For now, just log, later connect to backend/localStorage
    }
  }
};
</script>

<style scoped>
.profile-page {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}
</style>