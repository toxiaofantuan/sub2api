<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
    <!-- Background -->
    <div class="auth-canvas absolute inset-0"></div>

    <!-- Quiet grid texture -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="auth-grid absolute inset-0"></div>
    </div>

    <!-- Content Container -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="mb-8 text-center">
        <!-- Custom Logo or Default Logo -->
        <template v-if="settingsLoaded">
          <div
            class="auth-logo-glass brand-glass-logo mb-4 inline-flex items-center justify-center"
          >
            <img :src="siteLogo || '/logo.png'" alt="Logo" class="brand-glass-logo-image h-16 w-auto max-w-[180px] object-contain" />
          </div>
          <h1 class="text-gradient mb-2 text-3xl font-bold">
            {{ siteName }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-dark-400">
            {{ siteSubtitle }}
          </p>
        </template>
      </div>

      <!-- Card Container -->
      <div class="auth-glass-card card-glass rounded-md p-8">
        <slot />
      </div>

      <!-- Footer Links -->
      <div class="mt-6 text-center text-sm">
        <slot name="footer" />
      </div>

      <!-- Copyright -->
      <div class="mt-8 text-center text-xs text-gray-400 dark:text-dark-500">
        &copy; {{ currentYear }} {{ siteName }}. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { sanitizeUrl } from '@/utils/url'

const appStore = useAppStore()

const siteName = computed(() => appStore.siteName || 'Sub2API')
const siteLogo = computed(() => sanitizeUrl(appStore.siteLogo || '', { allowRelative: true, allowDataUrl: true }))
const siteSubtitle = computed(() => appStore.cachedPublicSettings?.site_subtitle || 'Subscription to API Conversion Platform')
const settingsLoaded = computed(() => appStore.publicSettingsLoaded)

const currentYear = computed(() => new Date().getFullYear())

onMounted(() => {
  appStore.fetchPublicSettings()
})
</script>

<style scoped>
.auth-canvas {
  background:
    linear-gradient(125deg, rgba(190, 225, 255, 0.62) 0%, rgba(190, 225, 255, 0) 38%),
    linear-gradient(235deg, rgba(226, 245, 255, 0.74) 0%, rgba(226, 245, 255, 0) 44%),
    linear-gradient(180deg, var(--ui-canvas) 0%, var(--ui-canvas-end) 100%);
}

.auth-grid {
  background-image:
    linear-gradient(rgba(98, 91, 164, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(90, 167, 223, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.72), transparent 88%);
}

.auth-glass-card {
  border: 1px solid var(--ui-border);
  background: var(--ui-surface);
  box-shadow: var(--ui-shadow-hover);
  backdrop-filter: blur(32px) saturate(1.55);
  -webkit-backdrop-filter: blur(32px) saturate(1.55);
}

.auth-logo-glass {
  border-radius: 24px;
  padding: 0.75rem;
}

.text-gradient {
  color: transparent;
  background-image: linear-gradient(105deg, var(--ui-ink) 0%, var(--ui-primary-strong) 58%, var(--ui-accent) 100%);
  background-clip: text;
  -webkit-background-clip: text;
}
</style>
