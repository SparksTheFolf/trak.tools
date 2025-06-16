<template>
  <footer class="bg-dark text-light py-4 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <h5>Trak.Tools</h5>
          <p class="mb-2">
            Trak.Tools powered by GTFS, Is an <a href="https://github.com/SparksTheFolf/trak.tools">open-source</a> project to make transit data usable for everyone.
          </p>
          <p>
            Created by <a href="NolanTrapp.com" class="text-light text-decoration-none">Nolan Trapp</a> and contributors.
          </p>
        </div>
        <div class="col-md-4 text-md-end">
          <a href="#" class="text-light text-decoration-none me-3">
            <i class="bi bi-github me-1"></i>
            GitHub
          </a>
          <a href="https://api-v3.mbta.com/" target="_blank" class="text-light text-decoration-none">
            <i class="bi bi-link-45deg me-1"></i>
            MBTA API
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
footer a:hover {
  color: #adb5bd !important;
}
</style>