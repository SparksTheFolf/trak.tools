<template>
  <div class="container py-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading route details...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>Error:</strong> {{ error }}
      <router-link to="/routes" class="btn btn-outline-danger ms-2">
        Back to Routes
      </router-link>
    </div>

    <!-- Route Details -->
    <div v-if="!loading && !error && route">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/routes">Routes</router-link>
          </li>
          <li class="breadcrumb-item active">{{ route.attributes.long_name }}</li>
        </ol>
      </nav>

      <!-- Route Header -->
      <div class="row mb-4">
        <div class="col-lg-8">
          <div class="d-flex align-items-center mb-3">
            <div 
              class="route-color-indicator me-3"
              :style="{ backgroundColor: route.attributes.color ? `#${route.attributes.color}` : '#6c757d' }"
            ></div>
            <div>
              <h1 class="mb-1">{{ route.attributes.long_name }}</h1>
              <p class="text-muted mb-0">{{ route.id }} • {{ getRouteType(route.attributes.type) }}</p>
            </div>
          </div>
          <p v-if="route.attributes.description">{{ route.attributes.description }}</p>
        </div>
        <div class="col-lg-4 text-lg-end">
          <button 
            class="btn btn-outline-primary me-2"
            @click="refreshData"
            :disabled="refreshing"
          >
            <i class="bi bi-arrow-clockwise me-1"></i>
            {{ refreshing ? 'Refreshing...' : 'Refresh' }}
          </button>
          <button 
            class="btn btn-outline-secondary"
            @click="showRouteJson = !showRouteJson"
          >
            <i class="bi bi-code me-1"></i>
            JSON
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link active" 
            data-bs-toggle="tab" 
            data-bs-target="#stops-tab"
            role="tab"
          >
            <i class="bi bi-geo-alt me-2"></i>
            Stops ({{ stops.length }})
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            data-bs-toggle="tab" 
            data-bs-target="#vehicles-tab"
            role="tab"
          >
            <i class="bi bi-truck me-2"></i>
            Vehicles ({{ vehicles.length }})
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            data-bs-toggle="tab" 
            data-bs-target="#alerts-tab"
            role="tab"
          >
            <i class="bi bi-exclamation-triangle me-2"></i>
            Alerts
          </button>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Stops Tab -->
        <div class="tab-pane fade show active" id="stops-tab" role="tabpanel">
          <div v-if="loadingStops" class="text-center py-3">
            <div class="spinner-border spinner-border-sm text-primary"></div>
            <span class="ms-2">Loading stops...</span>
          </div>
          
          <div class="row" v-else>
            <div class="col-lg-8">
              <div class="list-group">
                <div 
                  v-for="(stop, index) in stops" 
                  :key="stop.id" 
                  class="list-group-item"
                >
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="mb-1">
                        <span class="badge bg-secondary me-2">{{ index + 1 }}</span>
                        {{ stop.attributes.name }}
                      </h6>
                      <p class="mb-1 text-muted">{{ stop.id }}</p>
                      <small class="text-muted">
                        <i class="bi bi-geo-alt me-1"></i>
                        {{ stop.attributes.latitude }}, {{ stop.attributes.longitude }}
                      </small>
                    </div>
                    <button 
                      class="btn btn-sm btn-outline-primary"
                      @click="toggleStopJson(stop.id)"
                    >
                      <i class="bi bi-code"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-info-circle me-2"></i>
                    Stop Information
                  </h5>
                </div>
                <div class="card-body">
                  <p class="text-muted">
                    This route has {{ stops.length }} stops. Click on any stop to view its raw JSON data.
                  </p>
                  <button 
                    class="btn btn-outline-secondary btn-sm w-100"
                    @click="showStopsJson = !showStopsJson"
                  >
                    <i class="bi bi-code me-1"></i>
                    View All Stops JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vehicles Tab -->
        <div class="tab-pane fade" id="vehicles-tab" role="tabpanel">
          <div v-if="loadingVehicles" class="text-center py-3">
            <div class="spinner-border spinner-border-sm text-primary"></div>
            <span class="ms-2">Loading vehicles...</span>
          </div>
          
          <div v-else-if="vehicles.length === 0" class="text-center py-5">
            <i class="bi bi-truck display-4 text-muted"></i>
            <p class="text-muted mt-3">No vehicle data available for this route</p>
          </div>
          
          <div v-else class="row g-3">
            <div v-for="vehicle in vehicles" :key="vehicle.id" class="col-md-6 col-lg-4">
              <div class="card">
                <div class="card-body">
                  <h6 class="card-title">
                    <i class="bi bi-truck me-2"></i>
                    Vehicle {{ vehicle.id }}
                  </h6>
                  <p class="card-text">
                    <small class="text-muted">
                      Status: {{ vehicle.attributes.current_status || 'Unknown' }}
                    </small>
                  </p>
                  <button 
                    class="btn btn-outline-primary btn-sm"
                    @click="toggleVehicleJson(vehicle.id)"
                  >
                    <i class="bi bi-code me-1"></i>
                    View JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alerts Tab -->
        <div class="tab-pane fade" id="alerts-tab" role="tabpanel">
          <div class="text-center py-5">
            <i class="bi bi-exclamation-triangle display-4 text-muted"></i>
            <p class="text-muted mt-3">Service alerts feature coming soon</p>
          </div>
        </div>
      </div>

      <!-- JSON Viewers -->
      <JsonViewer 
        v-if="showRouteJson" 
        :data="route" 
        :title="`Route ${route.id} - Raw JSON`"
        @close="showRouteJson = false"
      />
      
      <JsonViewer 
        v-if="showStopsJson" 
        :data="stops" 
        title="All Stops - Raw JSON"
        @close="showStopsJson = false"
      />
      
      <JsonViewer 
        v-if="selectedStop" 
        :data="selectedStop" 
        :title="`Stop ${selectedStop.attributes.name} - Raw JSON`"
        @close="selectedStop = null"
      />
      
      <JsonViewer 
        v-if="selectedVehicle" 
        :data="selectedVehicle" 
        :title="`Vehicle ${selectedVehicle.id} - Raw JSON`"
        @close="selectedVehicle = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mbtaApi } from '../services/api'
import JsonViewer from '../components/JsonViewer.vue'

const props = defineProps<{
  id: string
}>()

const route = ref(null)
const stops = ref([])
const vehicles = ref([])
const loading = ref(false)
const loadingStops = ref(false)
const loadingVehicles = ref(false)
const refreshing = ref(false)
const error = ref('')

const showRouteJson = ref(false)
const showStopsJson = ref(false)
const selectedStop = ref(null)
const selectedVehicle = ref(null)

const routeTypes = {
  0: 'Light Rail',
  1: 'Subway/Metro',
  2: 'Rail',
  3: 'Bus',
  4: 'Ferry'
}

const fetchRouteDetails = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await mbtaApi.get(`/routes/${props.id}`)
    route.value = response.data.data
  } catch (err: any) {
    error.value = `Failed to fetch route details: ${err.message}`
  } finally {
    loading.value = false
  }
}

const fetchStops = async () => {
  loadingStops.value = true
  
  try {
    const response = await mbtaApi.get(`/stops?filter[route]=${props.id}`)
    stops.value = response.data.data
  } catch (err: any) {
    console.error('Failed to fetch stops:', err)
  } finally {
    loadingStops.value = false
  }
}

const fetchVehicles = async () => {
  loadingVehicles.value = true
  
  try {
    const response = await mbtaApi.get(`/vehicles?filter[route]=${props.id}`)
    vehicles.value = response.data.data
  } catch (err: any) {
    console.error('Failed to fetch vehicles:', err)
  } finally {
    loadingVehicles.value = false
  }
}

const refreshData = async () => {
  refreshing.value = true
  await Promise.all([fetchRouteDetails(), fetchStops(), fetchVehicles()])
  refreshing.value = false
}

const getRouteType = (type: number): string => {
  return routeTypes[type] || 'Unknown'
}

const toggleStopJson = (stopId: string) => {
  const stop = stops.value.find((s: any) => s.id === stopId)
  selectedStop.value = selectedStop.value?.id === stopId ? null : stop
}

const toggleVehicleJson = (vehicleId: string) => {
  const vehicle = vehicles.value.find((v: any) => v.id === vehicleId)
  selectedVehicle.value = selectedVehicle.value?.id === vehicleId ? null : vehicle
}

onMounted(() => {
  fetchRouteDetails()
  fetchStops()
  fetchVehicles()
})
</script>

<style scoped>
.route-color-indicator {
  width: 6px;
  height: 60px;
  border-radius: 3px;
}

.list-group-item {
  border-left: none;
  border-right: none;
}

.list-group-item:first-child {
  border-top: 1px solid rgba(0,0,0,.125);
}

.nav-tabs .nav-link {
  border: none;
  border-bottom: 2px solid transparent;
}

.nav-tabs .nav-link.active {
  border-bottom-color: var(--bs-primary);
  background-color: transparent;
}

.card {
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}
</style>