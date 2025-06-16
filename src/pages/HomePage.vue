<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-3">
              Explore Transit Data Without the Headache
            </h1>
            <p class="lead mb-4">
              Make GTFS and real-time transit data accessible, visual, and easy to understand. 
              Perfect for developers, transit enthusiasts, and anyone curious about public transportation.
            </p>
            <router-link 
              to="/routes" 
              class="btn btn-light btn-lg me-3"
            >
              <i class="bi bi-compass me-2"></i>
              Start Exploring
            </router-link>
            <a href="#what-is-gtfs" class="btn btn-outline-light btn-lg">
              Learn More
            </a>
          </div>
          <div class="col-lg-4 text-center">
            <i class="bi bi-train-front display-1 opacity-75"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- MBTA Quick Start -->
    <section class="py-5">
      <div class="container">
        <h2 class="text-center mb-5">Quick Start with MBTA Lines</h2>
        <div class="row g-3">
          <div class="col-md-3 col-sm-6" v-for="line in mbtaLines" :key="line.id">
            <router-link 
              :to="`/routes/${line.id}`" 
              class="btn w-100 text-white fw-bold"
              :style="{ backgroundColor: line.color }"
            >
              <i class="bi bi-train-front me-2"></i>
              {{ line.name }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- What is GTFS Section -->
    <section id="what-is-gtfs" class="py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <h2 class="mb-4">What is GTFS?</h2>
            <p>
              <strong>General Transit Feed Specification (GTFS)</strong> is a data specification 
              that allows public transit agencies to publish their transit data in a format that 
              can be consumed by a wide variety of software applications.
            </p>
            <p>
              GTFS is split into two main components:
            </p>
            <ul>
              <li><strong>GTFS Static:</strong> Schedules, stops, routes, and fare information</li>
              <li><strong>GTFS Realtime:</strong> Live updates including vehicle positions, service alerts, and trip updates</li>
            </ul>
          </div>
          <div class="col-lg-6">
            <h2 class="mb-4">Why Trak.tools?</h2>
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">
                  <i class="bi bi-check-circle-fill text-success me-2"></i>
                  No Complex APIs
                </h5>
                <p class="card-text">
                  Skip the API documentation headaches. We handle the complexity for you.
                </p>
              </div>
            </div>
            <div class="card mt-3">
              <div class="card-body">
                <h5 class="card-title">
                  <i class="bi bi-eye-fill text-info me-2"></i>
                  Visual & Intuitive
                </h5>
                <p class="card-text">
                  See your transit data in a clean, organized, and human-readable format.
                </p>
              </div>
            </div>
            <div class="card mt-3">
              <div class="card-body">
                <h5 class="card-title">
                  <i class="bi bi-code-square text-warning me-2"></i>
                  Developer Friendly
                </h5>
                <p class="card-text">
                  Raw JSON available for every request. Perfect for understanding data structure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mbtaLines = ref([
  { id: 'Red', name: 'Red Line', color: '#DA291C' },
  { id: 'Orange', name: 'Orange Line', color: '#ED8B00' },
  { id: 'Blue', name: 'Blue Line', color: '#003DA5' },
  { id: 'Green-B', name: 'Green Line B', color: '#00843D' },
  { id: 'Green-C', name: 'Green Line C', color: '#00843D' },
  { id: 'Green-D', name: 'Green Line D', color: '#00843D' },
  { id: 'Green-E', name: 'Green Line E', color: '#00843D' }
])
</script>

<style scoped>
.btn:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}
</style>