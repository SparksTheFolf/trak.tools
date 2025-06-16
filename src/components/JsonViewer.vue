<template>
  <pre class="json-viewer">
    <code>{{ formattedJson }}</code>
  </pre>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  data: unknown;
}>();

const formattedJson = computed(() => {
  try {
    return JSON.stringify(props.data, null, 2);
  } catch {
    return 'Invalid JSON data';
  }
});
</script>

<style scoped>
.json-viewer {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 5px;
  font-family: monospace;
  white-space: pre-wrap;
  overflow-x: auto;
  max-height: 400px;
}
</style>
