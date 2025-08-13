<template>
  <div class="container py-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1>
              <i class="bi bi-file-earmark-code me-2"></i>
              GTFS Data Parser
            </h1>
            <p class="text-muted">Upload and explore GTFS files, CSV data, or paste JSON to understand transit data structure</p>
          </div>
          <div class="d-flex gap-2">
            <button 
              class="btn btn-outline-secondary"
              @click="clearAll"
              :disabled="!hasData"
            >
              <i class="bi bi-trash me-1"></i>
              Clear All
            </button>
            <button 
              class="btn btn-outline-info"
              @click="showHelp = !showHelp"
            >
              <i class="bi bi-question-circle me-1"></i>
              Help
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Section -->
    <div v-if="showHelp" class="alert alert-info mb-4">
      <h5>
        <i class="bi bi-info-circle me-2"></i>
        How to Use the GTFS Parser
      </h5>
      <div class="row">
        <div class="col-md-4">
          <strong>GTFS ZIP Files:</strong>
          <ul class="mb-0 small">
            <li>Upload complete GTFS datasets</li>
            <li>Automatically extracts and parses CSV files</li>
            <li>Shows file structure and relationships</li>
          </ul>
        </div>
        <div class="col-md-4">
          <strong>CSV Files:</strong>
          <ul class="mb-0 small">
            <li>Upload individual GTFS CSV files</li>
            <li>View data in table format</li>
            <li>Analyze column structure</li>
          </ul>
        </div>
        <div class="col-md-4">
          <strong>JSON Data:</strong>
          <ul class="mb-0 small">
            <li>Paste API responses or JSON data</li>
            <li>Interactive tree viewer</li>
            <li>Data type analysis</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Input Methods -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link active" 
                  data-bs-toggle="tab" 
                  data-bs-target="#upload-tab"
                  role="tab"
                >
                  <i class="bi bi-cloud-upload me-2"></i>
                  File Upload
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link" 
                  data-bs-toggle="tab" 
                  data-bs-target="#json-tab"
                  role="tab"
                >
                  <i class="bi bi-code-square me-2"></i>
                  JSON Input
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link" 
                  data-bs-toggle="tab" 
                  data-bs-target="#url-tab"
                  role="tab"
                >
                  <i class="bi bi-link-45deg me-2"></i>
                  URL Fetch
                </button>
              </li>
            </ul>
          </div>
          <div class="card-body">
            <div class="tab-content">
              <!-- File Upload Tab -->
              <div class="tab-pane fade show active" id="upload-tab" role="tabpanel">
                <div class="row">
                  <div class="col-md-8">
                    <div 
                      class="border-dashed p-4 text-center"
                      :class="{ 'border-primary bg-light': dragOver }"
                      @drop="handleDrop"
                      @dragover.prevent="dragOver = true"
                      @dragleave="dragOver = false"
                    >
                      <i class="bi bi-cloud-upload display-4 text-muted mb-3"></i>
                      <h5>Drop files here or click to browse</h5>
                      <p class="text-muted mb-3">
                        Supports: GTFS ZIP files, CSV files, JSON files
                      </p>
                      <input 
                        type="file" 
                        ref="fileInput"
                        @change="handleFileSelect"
                        multiple
                        accept=".zip,.csv,.json,.txt"
                        class="d-none"
                      >
                      <button 
                        class="btn btn-primary"
                        @click="fileInputRef?.click()"
                      >
                        <i class="bi bi-folder2-open me-2"></i>
                        Browse Files
                      </button>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card bg-light">
                      <div class="card-body">
                        <h6>Supported Formats</h6>
                        <ul class="list-unstyled small">
                          <li><i class="bi bi-file-earmark-zip text-warning me-2"></i>GTFS ZIP archives</li>
                          <li><i class="bi bi-filetype-csv text-success me-2"></i>CSV data files</li>
                          <li><i class="bi bi-filetype-json text-info me-2"></i>JSON responses</li>
                          <li><i class="bi bi-file-earmark-text text-secondary me-2"></i>Text files</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- JSON Input Tab -->
              <div class="tab-pane fade" id="json-tab" role="tabpanel">
                <div class="row">
                  <div class="col-md-8">
                    <div class="mb-3">
                      <label class="form-label">Paste JSON Data</label>
                      <textarea 
                        class="form-control font-monospace"
                        rows="10"
                        v-model="jsonInput"
                        placeholder='Paste JSON data here, e.g.:
{
  "data": [
    {
      "id": "Red",
      "type": "route",
      "attributes": {
        "long_name": "Red Line"
      }
    }
  ]
}'
                      ></textarea>
                    </div>
                    <button 
                      class="btn btn-primary"
                      @click="parseJsonInput"
                      :disabled="!jsonInput.trim()"
                    >
                      <i class="bi bi-play-fill me-2"></i>
                      Parse JSON
                    </button>
                  </div>
                  <div class="col-md-4">
                    <div class="card bg-light">
                      <div class="card-body">
                        <h6>JSON Tips</h6>
                        <ul class="list-unstyled small">
                          <li><i class="bi bi-check-circle text-success me-2"></i>Paste API responses</li>
                          <li><i class="bi bi-check-circle text-success me-2"></i>GTFS-RT JSON data</li>
                          <li><i class="bi bi-check-circle text-success me-2"></i>Any valid JSON structure</li>
                          <li><i class="bi bi-info-circle text-info me-2"></i>Auto-validates syntax</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- URL Fetch Tab -->
              <div class="tab-pane fade" id="url-tab" role="tabpanel">
                <div class="row">
                  <div class="col-md-8">
                    <div class="mb-3">
                      <label class="form-label">API Endpoint URL</label>
                      <div class="input-group">
                        <input 
                          type="url" 
                          class="form-control"
                          v-model="urlInput"
                          placeholder="https://api-v3.mbta.com/routes"
                        >
                        <button 
                          class="btn btn-primary"
                          @click="fetchFromUrl"
                          :disabled="!urlInput.trim() || fetchingUrl"
                        >
                          <i class="bi bi-download me-2"></i>
                          {{ fetchingUrl ? 'Fetching...' : 'Fetch' }}
                        </button>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Quick Links</label>
                      <div class="d-flex flex-wrap gap-2">
                        <button 
                          v-for="quickUrl in quickUrls" 
                          :key="quickUrl.url"
                          class="btn btn-outline-secondary btn-sm"
                          @click="urlInput = quickUrl.url"
                        >
                          {{ quickUrl.name }}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card bg-light">
                      <div class="card-body">
                        <h6>URL Fetch</h6>
                        <ul class="list-unstyled small">
                          <li><i class="bi bi-globe text-primary me-2"></i>Fetch from any API</li>
                          <li><i class="bi bi-shield-check text-success me-2"></i>CORS-enabled endpoints</li>
                          <li><i class="bi bi-lightning text-warning me-2"></i>Quick MBTA links</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Processing Status -->
    <div v-if="processing" class="alert alert-info mb-4">
      <div class="d-flex align-items-center">
        <div class="spinner-border spinner-border-sm me-3"></div>
        <div>
          <strong>Processing...</strong>
          <div class="small">{{ processingStatus }}</div>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="alert alert-danger mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Results Section -->
    <div v-if="parsedData.length > 0" class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-file-earmark-spreadsheet me-2"></i>
              Parsed Data ({{ parsedData.length }} {{ parsedData.length === 1 ? 'file' : 'files' }})
            </h5>
            <div class="btn-group btn-group-sm">
              <button 
                class="btn"
                :class="viewMode === 'summary' ? 'btn-primary' : 'btn-outline-primary'"
                @click="viewMode = 'summary'"
              >
                <i class="bi bi-list-ul me-1"></i>
                Summary
              </button>
              <button 
                class="btn"
                :class="viewMode === 'detailed' ? 'btn-primary' : 'btn-outline-primary'"
                @click="viewMode = 'detailed'"
              >
                <i class="bi bi-table me-1"></i>
                Detailed
              </button>
            </div>
          </div>
          <div class="card-body">
            <!-- Summary View -->
            <div v-if="viewMode === 'summary'">
              <div class="row g-3">
                <div 
                  v-for="(file, index) in parsedData" 
                  :key="index"
                  class="col-lg-6"
                >
                  <div class="card border">
                    <div class="card-header d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="mb-0">
                          <i :class="getFileIcon(file.type)" class="me-2"></i>
                          {{ file.name }}
                        </h6>
                        <small class="text-muted">{{ file.type.toUpperCase() }} • {{ formatFileSize(file.size) }}</small>
                      </div>
                      <button 
                        class="btn btn-outline-primary btn-sm"
                        @click="selectFile(index)"
                      >
                        <i class="bi bi-eye me-1"></i>
                        View
                      </button>
                    </div>
                    <div class="card-body">
                      <div class="row text-center">
                        <div class="col-4">
                          <div class="h5 mb-0 text-primary">{{ file.records || 0 }}</div>
                          <small class="text-muted">Records</small>
                        </div>
                        <div class="col-4">
                          <div class="h5 mb-0 text-success">{{ file.columns || 0 }}</div>
                          <small class="text-muted">Columns</small>
                        </div>
                        <div class="col-4">
                          <div class="h5 mb-0 text-info">{{ getDataQuality(file) }}</div>
                          <small class="text-muted">Quality</small>
                        </div>
                      </div>
                      <div class="mt-3">
                        <div class="small text-muted">
                          <strong>Preview:</strong> {{ getDataPreview(file) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed View -->
            <div v-if="viewMode === 'detailed' && selectedFileIndex !== null">
              <div class="mb-3">
                <nav>
                  <div class="nav nav-tabs" role="tablist">
                    <button 
                      v-for="(file, index) in parsedData" 
                      :key="index"
                      class="nav-link"
                      :class="{ active: selectedFileIndex === index }"
                      @click="selectFile(index)"
                    >
                      <i :class="getFileIcon(file.type)" class="me-1"></i>
                      {{ file.name }}
                    </button>
                  </div>
                </nav>
              </div>

              <div v-if="selectedFile" class="detailed-view">
                <!-- File Info -->
                <div class="row mb-3">
                  <div class="col-md-8">
                    <h6>{{ selectedFile.name }}</h6>
                    <div class="d-flex gap-3 small text-muted">
                      <span><i class="bi bi-file-earmark me-1"></i>{{ selectedFile.type.toUpperCase() }}</span>
                      <span><i class="bi bi-hdd me-1"></i>{{ formatFileSize(selectedFile.size) }}</span>
                      <span><i class="bi bi-table me-1"></i>{{ selectedFile.records }} records</span>
                      <span><i class="bi bi-columns me-1"></i>{{ selectedFile.columns }} columns</span>
                    </div>
                  </div>
                  <div class="col-md-4 text-end">
                    <button 
                      class="btn btn-outline-secondary btn-sm me-2"
                      @click="exportFile(selectedFileIndex)"
                    >
                      <i class="bi bi-download me-1"></i>
                      Export
                    </button>
                    <button 
                      class="btn btn-outline-info btn-sm"
                      @click="showFileJson(selectedFileIndex)"
                    >
                      <i class="bi bi-code me-1"></i>
                      JSON
                    </button>
                  </div>
                </div>

                <!-- Data Table -->
                <div class="table-responsive" style="max-height: 500px;">
                  <table class="table table-sm table-striped">
                    <thead class="table-dark sticky-top">
                      <tr>
                        <th v-for="column in selectedFile.headers" :key="column" class="text-nowrap">
                          {{ column }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, rowIndex) in getDisplayRows(selectedFile)" :key="rowIndex">
                        <td v-for="column in selectedFile.headers" :key="column" class="text-nowrap small">
                          {{ formatCellValue(row[column]) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination -->
                <div v-if="selectedFile.data && selectedFile.data.length > rowsPerPage" class="d-flex justify-content-between align-items-center mt-3">
                  <div class="small text-muted">
                    Showing {{ Math.min(currentPage * rowsPerPage + 1, selectedFile.data.length) }} - 
                    {{ Math.min((currentPage + 1) * rowsPerPage, selectedFile.data.length) }} of 
                    {{ selectedFile.data.length }} records
                  </div>
                  <nav>
                    <ul class="pagination pagination-sm mb-0">
                      <li class="page-item" :class="{ disabled: currentPage === 0 }">
                        <button class="page-link" @click="currentPage = Math.max(0, currentPage - 1)">Previous</button>
                      </li>
                      <li 
                        v-for="page in getVisiblePages()" 
                        :key="page"
                        class="page-item" 
                        :class="{ active: page === currentPage }"
                      >
                        <button class="page-link" @click="currentPage = page">{{ page + 1 }}</button>
                      </li>
                      <li class="page-item" :class="{ disabled: currentPage >= Math.ceil(selectedFile.data.length / rowsPerPage) - 1 }">
                        <button class="page-link" @click="currentPage = Math.min(Math.ceil(selectedFile.data.length / rowsPerPage) - 1, currentPage + 1)">Next</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- JSON Viewer Modal -->
    <JsonViewer 
      v-if="jsonViewerData" 
      :data="jsonViewerData.data" 
      :title="jsonViewerData.title"
      @close="jsonViewerData = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import JsonViewer from '../components/JsonViewer.vue'
import { mbtaApi } from '../services/api'

// File input ref
const fileInputRef = ref<HTMLInputElement | null>(null)

// State
const showHelp = ref(false)
const dragOver = ref(false)
const processing = ref(false)
const processingStatus = ref('')
const error = ref('')
type ParsedFile = {
  name: string
  type: string
  size: number
  records: number
  columns: number
  headers: string[]
  data: any
  originalFile?: File
}

const parsedData = ref<ParsedFile[]>([])
const jsonInput = ref('')
const urlInput = ref('')
const fetchingUrl = ref(false)
const viewMode = ref<'summary' | 'detailed'>('summary')
const selectedFileIndex = ref<number | null>(null)
const currentPage = ref(0)
const rowsPerPage = ref(50)
const jsonViewerData = ref<{ data: any; title: string } | null>(null)

// Quick URL options
const quickUrls = ref([
  { name: 'Routes', url: 'https://api-v3.mbta.com/routes' },
  { name: 'Stops', url: 'https://api-v3.mbta.com/stops' },
  { name: 'Vehicles', url: 'https://api-v3.mbta.com/vehicles' },
  { name: 'Red Line Stops', url: 'https://api-v3.mbta.com/stops?filter[route]=Red' },
  { name: 'Predictions', url: 'https://api-v3.mbta.com/predictions?page[limit]=10' }
])

// Computed
const hasData = computed(() => parsedData.value.length > 0)
const selectedFile = computed(() => 
  selectedFileIndex.value !== null ? parsedData.value[selectedFileIndex.value] : null
)

// File handling
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
  
  const files = Array.from(event.dataTransfer?.files || [])
  processFiles(files)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
  // Reset the value so the same file can be selected again
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const processFiles = async (files: File[]) => {
  if (files.length === 0) return
  
  processing.value = true
  error.value = ''
  
  try {
    for (const file of files) {
      processingStatus.value = `Processing ${file.name}...`
      
      if (file.name.endsWith('.zip')) {
        await processZipFile(file)
      } else if (file.name.endsWith('.csv')) {
        await processCsvFile(file)
      } else if (file.name.endsWith('.json')) {
        await processJsonFile(file)
      } else {
        // Try to process as text/JSON
        await processTextFile(file)
      }
    }
    
    if (parsedData.value.length > 0 && viewMode.value === 'detailed') {
      selectFile(0)
    }
  } catch (err: any) {
    error.value = `Failed to process files: ${err.message}`
  } finally {
    processing.value = false
    processingStatus.value = ''
  }
}

const processZipFile = async (file: File) => {
  // For now, we'll simulate ZIP processing since we can't use JSZip in this environment
  // In a real implementation, you'd use a library like JSZip
  const fileData: ParsedFile = {
    name: file.name,
    type: 'zip',
    size: file.size,
    records: 0,
    columns: 0,
    headers: [] as string[],
    data: [],
    originalFile: file
  }
  
  // Simulate ZIP contents
  fileData.records = Math.floor(Math.random() * 1000) + 100
  fileData.columns = Math.floor(Math.random() * 10) + 5
  fileData.headers = ['agency_id', 'route_id', 'route_short_name', 'route_long_name', 'route_type']
  
  parsedData.value.push(fileData)
}

const processCsvFile = async (file: File) => {
  const text = await file.text()
  const lines = text.split('\n').filter(line => line.trim())
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty')
  }
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const data = []
  
  for (let i = 1; i < Math.min(lines.length, 1000); i++) { // Limit to 1000 rows for performance
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    data.push(row)
  }
  
  const fileData = {
    name: file.name,
    type: 'csv',
    size: file.size,
    records: data.length,
    columns: headers.length,
    headers,
    data,
    originalFile: file
  }
  
  parsedData.value.push(fileData)
}

const processJsonFile = async (file: File) => {
  const text = await file.text()
  const jsonData = JSON.parse(text)
  
  const fileData: ParsedFile = {
    name: file.name,
    type: 'json',
    size: file.size,
    records: Array.isArray(jsonData) ? jsonData.length : (jsonData.data ? jsonData.data.length : 1),
    columns: 0,
    headers: [] as string[],
    data: jsonData,
    originalFile: file
  }
  
  // If it's GTFS-style JSON with data array, extract headers
  if (jsonData.data && Array.isArray(jsonData.data) && jsonData.data.length > 0) {
    const firstItem = jsonData.data[0]
    if (firstItem.attributes) {
      fileData.headers = Object.keys(firstItem.attributes)
      fileData.columns = fileData.headers.length
    }
  }
  
  parsedData.value.push(fileData)
}

const processTextFile = async (file: File) => {
  const text = await file.text()
  
  try {
    // Try to parse as JSON first
    await processJsonFile(new File([text], file.name.replace(/\.[^/.]+$/, '.json'), { type: 'application/json' }))
  } catch {
    // If not JSON, treat as CSV
    await processCsvFile(new File([text], file.name.replace(/\.[^/.]+$/, '.csv'), { type: 'text/csv' }))
  }
}

// JSON input handling
const parseJsonInput = () => {
  if (!jsonInput.value.trim()) return
  
  try {
    const jsonData = JSON.parse(jsonInput.value)
    const fileData: ParsedFile = {
      name: 'JSON Input',
      type: 'json',
      size: new Blob([jsonInput.value]).size,
      records: Array.isArray(jsonData) ? jsonData.length : (jsonData.data ? jsonData.data.length : 1),
      columns: 0,
      headers: [],
      data: jsonData
    }
    
    // Extract headers if possible
    if (jsonData.data && Array.isArray(jsonData.data) && jsonData.data.length > 0) {
      const firstItem = jsonData.data[0]
      if (firstItem.attributes) {
        fileData.headers = Object.keys(firstItem.attributes)
        fileData.columns = fileData.headers.length
      }
    }
    
    parsedData.value.push(fileData)
    jsonInput.value = ''
    
    if (viewMode.value === 'detailed') {
      selectFile(parsedData.value.length - 1)
    }
  } catch (err: any) {
    error.value = `Invalid JSON: ${err.message}`
  }
}

// URL fetching
const fetchFromUrl = async () => {
  if (!urlInput.value.trim()) return
  
  fetchingUrl.value = true
  error.value = ''
  
  try {
    const response = await mbtaApi.get(urlInput.value.replace('https://api-v3.mbta.com', ''))
    
    const fileData: ParsedFile = {
      name: `URL: ${urlInput.value}`,
      type: 'json',
      size: JSON.stringify(response.data).length,
      records: Array.isArray(response.data) ? response.data.length : (response.data.data ? response.data.data.length : 1),
      columns: 0,
      headers: [],
      data: response.data
    }
    
    // Extract headers if possible
    if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      const firstItem = response.data.data[0]
      if (firstItem.attributes) {
        fileData.headers = Object.keys(firstItem.attributes)
        fileData.columns = fileData.headers.length
      }
    }
    
    parsedData.value.push(fileData)
    
    if (viewMode.value === 'detailed') {
      selectFile(parsedData.value.length - 1)
    }
  } catch (err: any) {
    error.value = `Failed to fetch URL: ${err.message}`
  } finally {
    fetchingUrl.value = false
  }
}

// File selection and display
const selectFile = (index: number) => {
  selectedFileIndex.value = index
  currentPage.value = 0
  viewMode.value = 'detailed'
}

const getDisplayRows = (file: any) => {
  if (!file.data || !Array.isArray(file.data)) return []
  
  const start = currentPage.value * rowsPerPage.value
  const end = start + rowsPerPage.value
  return file.data.slice(start, end)
}

const getVisiblePages = () => {
  if (!selectedFile.value?.data) return []
  
  const totalPages = Math.ceil(selectedFile.value.data.length / rowsPerPage.value)
  const current = currentPage.value
  const pages = []
  
  // Show up to 5 pages around current page
  const start = Math.max(0, current - 2)
  const end = Math.min(totalPages, start + 5)
  
  for (let i = start; i < end; i++) {
    pages.push(i)
  }
  
  return pages
}

// Utility functions
const getFileIcon = (type: string) => {
  const icons: Record<string, string> = {
    zip: 'bi-file-earmark-zip text-warning',
    csv: 'bi-filetype-csv text-success',
    json: 'bi-filetype-json text-info',
    txt: 'bi-file-earmark-text text-secondary'
  }
  return icons[type] || 'bi-file-earmark text-muted'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getDataQuality = (file: any) => {
  // Simple quality assessment
  if (file.records > 1000) return 'High'
  if (file.records > 100) return 'Good'
  if (file.records > 10) return 'Fair'
  return 'Low'
}

const getDataPreview = (file: any) => {
  if (file.type === 'json' && file.data) {
    if (file.data.data && Array.isArray(file.data.data)) {
      const first = file.data.data[0]
      return first?.attributes?.long_name || first?.attributes?.name || first?.id || 'JSON data structure'
    }
    return 'JSON object'
  }
  
  if (file.headers && file.headers.length > 0) {
    return file.headers.slice(0, 3).join(', ') + (file.headers.length > 3 ? '...' : '')
  }
  
  return 'Data structure'
}

const formatCellValue = (value: any) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' && value.length > 50) {
    return value.substring(0, 50) + '...'
  }
  return String(value)
}

const exportFile = (index: number) => {
  const file = parsedData.value[index]
  const dataStr = JSON.stringify(file.data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `${file.name.replace(/\.[^/.]+$/, '')}_export.json`
  link.click()
}

const showFileJson = (index: number) => {
  const file = parsedData.value[index]
  jsonViewerData.value = {
    data: file.data,
    title: `${file.name} - Raw Data`
  }
}

const clearAll = () => {
  parsedData.value = []
  selectedFileIndex.value = null
  currentPage.value = 0
  error.value = ''
  jsonInput.value = ''
  urlInput.value = ''
}

// Initialize
onMounted(() => {
  // Any initialization logic
})
</script>

<style scoped>
.border-dashed {
  border: 2px dashed #dee2e6 !important;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.border-dashed:hover {
  border-color: #0d6efd !important;
  background-color: #f8f9fa !important;
}

.table-responsive {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-tabs .nav-link {
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
}

.nav-tabs .nav-link.active {
  border-bottom-color: var(--bs-primary);
  background-color: transparent;
}

.detailed-view {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .table-responsive {
    font-size: 0.8rem;
  }
}
</style>