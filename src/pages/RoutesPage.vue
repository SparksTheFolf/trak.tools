<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="mb-1">Routes</h1>
        <p class="text-muted mb-0">MBTA Subway, Bus, Ferry, and Rail lines</p>
      </div>
      <button 
        class="btn btn-outline-primary"
        @click="refreshRoutes"
        :disabled="loading"
      >
        <i class="bi bi-arrow-clockwise me-1"></i>
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Loading routes...</p>
    </div>

    <div v-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>Error:</strong> {{ error }}
    </div>

    <div class="row g-4" v-if="!loading && routes.length">
      <div 
        v-for="route in routes" 
        :key="route.id" 
        class="col-md-6 col-lg-4"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <div class="d-flex align-items-start mb-2">
              <div 
                class="route-color me-3"
                :style="{ backgroundColor: route.attributes.color ? `#${route.attributes.color}` : '#6c757d' }"
              ></div>
              <div class="flex-grow-1">
                <h5 class="card-title mb-1">
                  {{ route.attributes.long_name }}
                </h5>
                <p class="text-muted small mb-0">
                  {{ route.id }} • {{ getRouteType(route.attributes.type) }}
                </p>
              </div>
            </div>
            <p class="card-text small mt-2" v-if="route.attributes.description">
              {{ route.attributes.description }}
            </p>
            <div class="mt-auto d-flex justify-content-between align-items-center pt-3">
              <router-link 
                class="btn btn-sm btn-primary" 
                :to="`/routes/${route.id}`"
              >
                View Details
              </router-link>
              <button 
                class="btn btn-sm btn-outline-secondary"
                @click="viewJson(route)"
              >
                <i class="bi bi-code-slash me-1"></i>
                JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <JsonViewer 
      v-if="selectedRoute" 
      :data="selectedRoute" 
      :title="`Route ${selectedRoute.id} - Raw JSON`"
      @close="selectedRoute = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mbtaApi } from '../services/api'
import JsonViewer from '../components/JsonViewer.vue'

interface RouteAttributes {
  long_name: string
  short_name: string
  description?: string
  type: number
  color?: string
  text_color?: string
}

interface Route {
  id: string
  attributes: RouteAttributes
}

const routes = ref<Route[]>([])
const loading = ref(false)
const error = ref('')
const selectedRoute = ref<Route | null>(null)

const routeTypes: Record<number, string> = {
  0: 'Light Rail',
  1: 'Subway/Metro',
  2: 'Rail',
  3: 'Bus',
  4: 'Ferry'
}

const getRouteType = (type: number): string => {
  return routeTypes[type] || 'Unknown'
}

const fetchRoutes = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await mbtaApi.get('/routes')
    routes.value = response.data.data
  } catch (err: any) {
    error.value = `Failed to fetch routes: ${err.message}`
  } finally {
    loading.value = false
  }
}

const refreshRoutes = () => {
  fetchRoutes()
}

const viewJson = (route: Route) => {
  selectedRoute.value = route
}

onMounted(() => {
  fetchRoutes()
})
</script>

<style scoped>
.route-color {
  width: 6px;
  height: 48px;
  border-radius: 3px;
}
.card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>
