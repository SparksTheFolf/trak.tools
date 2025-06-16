<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-code-square me-2"></i>
            {{ title }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="btn-group btn-group-sm" role="group">
              <button 
                type="button" 
                class="btn"
                :class="viewMode === 'formatted' ? 'btn-primary' : 'btn-outline-primary'"
                @click="viewMode = 'formatted'"
              >
                <i class="bi bi-eye me-1"></i>
                Formatted
              </button>
              <button 
                type="button" 
                class="btn"
                :class="viewMode === 'raw' ? 'btn-primary' : 'btn-outline-primary'"
                @click="viewMode = 'raw'"
              >
                <i class="bi bi-code me-1"></i>
                Raw
              </button>
            </div>
            <button 
              class="btn btn-outline-secondary btn-sm"
              @click="copyToClipboard"
            >
              <i class="bi bi-clipboard me-1"></i>
              Copy
            </button>
          </div>
          
          <!-- Formatted View -->
          <div v-if="viewMode === 'formatted'" class="json-formatted">
            <div class="accordion" id="jsonAccordion">
              <div v-for="(section, key) in formattedData" :key="key" class="accordion-item">
                <h2 class="accordion-header">
                  <button 
                    class="accordion-button collapsed" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    :data-bs-target="`#collapse-${key}`"
                  >
                    <strong>{{ key }}</strong>
                    <span class="ms-2 text-muted">({{ getDataType(section) }})</span>
                  </button>
                </h2>
                <div 
                  :id="`collapse-${key}`" 
                  class="accordion-collapse collapse" 
                  data-bs-parent="#jsonAccordion"
                >
                  <div class="accordion-body">
                    <pre class="json-content">{{ JSON.stringify(section, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Raw View -->
          <div v-else class="json-raw">
            <pre class="json-content">{{ JSON.stringify(data, null, 2) }}</pre>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  data: any
  title: string
}>()

const viewMode = ref<'formatted' | 'raw'>('formatted')

const formattedData = computed(() => {
  if (Array.isArray(props.data)) {
    return { items: props.data }
  }
  return props.data
})

const getDataType = (value: any): string => {
  if (Array.isArray(value)) {
    return `Array of ${value.length} items`
  }
  if (typeof value === 'object' && value !== null) {
    return `Object with ${Object.keys(value).length} properties`
  }
  return typeof value
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(props.data, null, 2))
    // You could add a toast notification here
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}
</script>

<style scoped>
.json-content {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
  max-height: 400px;
  margin: 0;
}

.json-raw .json-content {
  max-height: 600px;
}

.accordion-button {
  font-size: 0.9rem;
}

.accordion-button:not(.collapsed) {
  background-color: var(--bs-primary);
  color: white;
}

.modal-xl {
  max-width: 90vw;
}

@media (max-width: 768px) {
  .modal-xl {
    max-width: 95vw;
  }
  
  .json-content {
    font-size: 0.75rem;
  }
}
</style>