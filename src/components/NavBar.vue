<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <div class="d-flex align-items-center">
        <router-link class="navbar-brand fw-bold me-3" to="/">
          <i class="bi bi-train-front me-2"></i>
          Trak.tools
        </router-link>
        
        <!-- Development Environment Indicator -->
        <div 
          v-if="isDevelopment" 
          class="badge bg-success px-2 py-1 me-3"
          style="font-size: 0.75rem;"
        >
          <i class="bi bi-code-slash me-1"></i>
          DEV
        </div>
      </div>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/routes">Routes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/upload">Upload</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/parse">Parse</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const isDevelopment = computed(() => {
  return import.meta.env.VITE_APP_ENV === 'DEV'
})
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}

.router-link-active {
  font-weight: 600;
}

.badge {
  border-radius: 4px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .badge {
    font-size: 0.7rem !important;
    padding: 0.25rem 0.5rem !important;
  }
}
</style>