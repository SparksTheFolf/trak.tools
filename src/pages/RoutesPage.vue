<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>MBTA Routes</h1>
        <p class="text-muted">Explore all available transit routes</p>
      </div>
      <button 
        class="btn btn-outline-primary"
        @click="fetchRoutes"
        :disabled="loading"
      >
        <i class="bi bi-arrow-clockwise me-2"></i>
        {{ loading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <!-- Route Type Filters -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-funnel me-2"></i>
          Filter by Route Type
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-2 col-sm-4 col-6 mb-2" v-for="(filter, key) in routeTypeFilters" :key="key">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                :id="`filter-${key}`"
                v-model="filter.enabled"
                @change="updateFilteredRoutes"
              >
              <label class="form-check-label" :for="`filter-${key}`">
                <i :class="filter.icon" class="me-1"></i>
                {{ filter.label }}
                <span class="badge bg-secondary ms-1">{{ getRouteCountByType(parseInt(key)) }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <button 
            class="btn btn-sm btn-outline-secondary me-2"
            @click="selectAllFilters"
          >
            Select All
          </button>
          <button 
            class="btn btn-sm btn-outline-secondary"
            @click="clearAllFilters"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="d-flex justify-content-between align-items-center mb-3" v-if="!loading && !error">
      <p class="text-muted mb-0">
        Showing {{ filteredRoutes.length }} of {{ routes.length }} routes
      </p>
      <div class="btn-group btn-group-sm" role="group">
        <button 
          type="button" 
          class="btn"
          :class="viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'"
          @click="viewMode = 'grid'"
        >
          <i class="bi bi-grid-3x3-gap me-1"></i>
          Grid
        </button>
        <button 
          type="button" 
          class="btn"
          :class="viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'"
          @click="viewMode = 'list'"
        >
          <i class="bi bi-list me-1"></i>
          List
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Fetching routes from MBTA API...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>Error:</strong> {{ error }}
      <button class="btn btn-sm btn-outline-danger ms-2" @click="fetchRoutes">
        Try Again
      </button>
    </div>

    <!-- No Results -->
    <div v-if="!loading && !error && filteredRoutes.length === 0 && routes.length > 0" class="text-center py-5">
      <i class="bi bi-search display-4 text-muted"></i>
      <h3 class="mt-3 text-muted">No routes match your filters</h3>
      <p class="text-muted">Try selecting different route types or clear all filters</p>
      <button class="btn btn-primary" @click="selectAllFilters">
        Show All Routes
      </button>
    </div>

    <!-- Routes Grid View -->
    <div v-if="!loading && !error && filteredRoutes.length > 0 && viewMode === 'grid'" class="row g-4">
      <div 
        v-for="route in filteredRoutes" 
        :key="route.id" 
        class="col-lg-4 col-md-6"
      >
        <div class="card h-100 shadow-sm route-card">
          <div class="card-header d-flex align-items-center">
            <div 
              class="route-color-indicator me-3"
              :style="{ backgroundColor: route.attributes.color ? `#${route.attributes.color}` : '#6c757d' }"
            ></div>
            <div class="flex-grow-1">
              <h5 class="card-title mb-0">{{ route.attributes.long_name }}</h5>
              <small class="text-muted">{{ route.id }}</small>
            </div>
            <span class="badge" :class="getRouteTypeBadgeClass(route.attributes.type)">
              {{ getRouteType(route.attributes.type) }}
            </span>
          </div>
          <div class="card-body">
            <p class="card-text">{{ route.attributes.description || 'No description available' }}</p>
          </div>
          <div class="card-footer bg-transparent">
            <div class="btn-group w-100" role="group">
              <router-link 
                :to="`/routes/${route.id}`"
                class="btn btn-primary btn-sm"
              >
                <i class="bi bi-info-circle me-1"></i>
                Details
              </router-link>
              <button 
                class="btn btn-outline-secondary btn-sm"
                @click="toggleRawJson(route.id)"
              >
                <i class="bi bi-code me-1"></i>
                JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Routes List View -->
    <div v-if="!loading && !error && filteredRoutes.length > 0 && viewMode === 'list'" class="list-group">
      <div 
        v-for="route in filteredRoutes" 
        :key="route.id" 
        class="list-group-item list-group-item-action"
      >
        <div class="d-flex justify-content-between align-items-start">
          <div class="d-flex align-items-center flex-grow-1">
            <div 
              class="route-color-indicator-small me-3"
              :style="{ backgroundColor: route.attributes.color ? `#${route.attributes.color}` : '#6c757d' }"
            ></div>
            <div class="flex-grow-1">
              <h6 class="mb-1">{{ route.attributes.long_name }}</h6>
              <p class="mb-1 text-muted small">{{ route.attributes.description || 'No description available' }}</p>
              <small class="text-muted">{{ route.id }}</small>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <span class="badge me-2" :class="getRouteTypeBadgeClass(route.attributes.type)">
              {{ getRouteType(route.attributes.type) }}
            </span>
            <div class="btn-group btn-group-sm" role="group">
              <router-link 
                :to="`/routes/${route.id}`"
                class="btn btn-primary btn-sm"
              >
                <i class="bi bi-info-circle"></i>
              </router-link>
              <button 
                class="btn btn-outline-secondary btn-sm"
                @click="toggleRawJson(route.id)"
              >
                <i class="bi bi-code"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- JSON Viewer -->
    <JsonViewer 
      v-if="selectedRoute" 
      :data="selectedRoute" 
      :title="`Route ${selectedRoute.id} - Raw JSON`"
      @close="selectedRoute = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { mbtaApi } from '../services/api'
import JsonViewer from '../components/JsonViewer.vue'

const routes = ref([])
const loading = ref(false)
const error = ref('')
const selectedRoute = ref(null)
const viewMode = ref<'grid' | 'list'>('grid')

const routeTypes = {
  0: 'Light Rail',
  1: 'Subway/Metro',
  2: 'Rail',
  3: 'Bus',
  4: 'Ferry'
}

const routeTypeFilters = ref({
  0: { label: 'Light Rail', enabled: true, icon: 'bi-train-lightrail-front' },
  1: { label: 'Subway/Metro', enabled: true, icon: 'bi-train-front' },
  2: { label: 'Rail', enabled: true, icon: 'bi-train-freight-front' },
  3: { label: 'Bus', enabled: true, icon: 'bi-bus-front' },
  4: { label: 'Ferry', enabled: true, icon: 'bi-water' }
})

const filteredRoutes = ref([])

const fetchRoutes = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await mbtaApi.get('/routes')
    routes.value = response.data.data
    updateFilteredRoutes()
  } catch (err: any) {
    error.value = `Failed to fetch routes: ${err.message}`
  } finally {
    loading.value = false
  }
}

const updateFilteredRoutes = () => {
  filteredRoutes.value = routes.value.filter((route: any) => {
    const routeType = route.attributes.type
    return routeTypeFilters.value[routeType]?.enabled || false
  })
}

const getRouteCountByType = (type: number): number => {
  return routes.value.filter((route: any) => route.attributes.type === type).length
}

const getRouteType = (type: number): string => {
  return routeTypes[type] || 'Unknown'
}

const getRouteTypeBadgeClass = (type: number): string => {
  const badgeClasses = {
    0: 'bg-success',      // Light Rail - Green
    1: 'bg-primary',      // Subway/Metro - Blue
    2: 'bg-secondary',    // Rail - Gray
    3: 'bg-warning',      // Bus - Yellow
    4: 'bg-info'          // Ferry - Light Blue
  }
  return badgeClasses[type] || 'bg-secondary'
}

const selectAllFilters = () => {
  Object.keys(routeTypeFilters.value).forEach(key => {
    routeTypeFilters.value[key].enabled = true
  })
  updateFilteredRoutes()
}

const clearAllFilters = () => {
  Object.keys(routeTypeFilters.value).forEach(key => {
    routeTypeFilters.value[key].enabled = false
  })
  updateFilteredRoutes()
}

const toggleRawJson = (routeId: string) => {
  const route = routes.value.find((r: any) => r.id === routeId)
  selectedRoute.value = selectedRoute.value?.id === routeId ? null : route
}

onMounted(() => {
  fetchRoutes()
})
</script>

<style scoped>
.route-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.route-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.route-color-indicator {
  width: 4px;
  height: 40px;
  border-radius: 2px;
}

.route-color-indicator-small {
  width: 4px;
  height: 30px;
  border-radius: 2px;
}

.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-radius: 0.375rem 0 0 0.375rem;
}

.btn-group .btn:last-child {
  border-radius: 0 0.375rem 0.375rem 0;
}

.list-group-item {
  transition: background-color 0.15s ease-in-out;
}

.list-group-item:hover {
  background-color: rgba(0,0,0,0.025);
}

.form-check-label {
  font-size: 0.9rem;
  cursor: pointer;
}

.card-header .badge {
  font-size: 0.7rem;
}

@media (max-width: 768px) {
  .btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .route-color-indicator-small {
    width: 3px;
    height: 25px;
  }
}
</style>