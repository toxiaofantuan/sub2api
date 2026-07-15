<template>
  <div class="search-input-shell relative w-full">
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon name="search" size="md" class="search-input-icon" />
    </div>
    <input
      :value="modelValue"
      type="text"
      class="input pl-10"
      :placeholder="placeholder"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import Icon from '@/components/icons/Icon.vue'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  debounceMs?: number
}>(), {
  placeholder: 'Search...',
  debounceMs: 300
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

const debouncedEmitSearch = useDebounceFn((value: string) => {
  emit('search', value)
}, props.debounceMs)

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  debouncedEmitSearch(value)
}
</script>

<style scoped>
.search-input-icon {
  color: rgba(36, 152, 242, 0.86);
  filter: drop-shadow(0 1px 2px rgba(36, 152, 242, 0.18));
  transition:
    color 0.2s ease,
    opacity 0.2s ease,
    filter 0.2s ease;
}

.search-input-shell:focus-within .search-input-icon {
  color: #0c78d8;
  opacity: 1;
  filter: drop-shadow(0 2px 4px rgba(36, 152, 242, 0.24));
}

:global(.dark) .search-input-icon {
  color: rgba(87, 183, 242, 0.92);
  filter: drop-shadow(0 1px 3px rgba(87, 183, 242, 0.16));
}

:global(.dark) .search-input-shell:focus-within .search-input-icon {
  color: rgba(124, 200, 255, 0.98);
  filter: drop-shadow(0 2px 5px rgba(124, 200, 255, 0.2));
}
</style>
