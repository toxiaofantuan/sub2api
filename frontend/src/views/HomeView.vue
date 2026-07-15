<template>
  <!-- Custom Home Content: Full Page Mode -->
  <div v-if="homeContent" class="min-h-screen">
    <!-- iframe mode -->
    <iframe
      v-if="isHomeContentUrl"
      :src="homeContent.trim()"
      class="h-screen w-full border-0"
      allowfullscreen
    ></iframe>
    <!-- HTML mode - SECURITY: homeContent is admin-only setting, XSS risk is acceptable -->
    <div v-else v-html="homeContent"></div>
  </div>

  <!-- Default Home Page -->
  <div
    v-else
    class="home-shell relative flex min-h-screen flex-col overflow-hidden"
  >
    <!-- Background Decorations -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="home-background-grid absolute inset-0"></div>
    </div>

    <!-- Header -->
    <header class="relative z-20 px-4 py-4 sm:px-6">
      <nav class="home-nav-shell mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
        <!-- Logo / Brand -->
        <router-link
          to="/home"
          class="home-brand-pill group flex min-w-0 items-center gap-3"
          aria-label="Home"
        >
          <div class="home-logo brand-glass-logo flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
            <img src="/logo.png" alt="Logo" class="brand-glass-logo-image max-h-full max-w-full object-contain" />
          </div>
          <span class="home-brand-copy min-w-0">
            <span class="home-brand-name block truncate text-sm font-semibold sm:text-base">{{ siteName }}</span>
            <span class="home-brand-subtitle hidden truncate text-[11px] sm:block">{{ siteSubtitle }}</span>
          </span>
        </router-link>

        <!-- Nav Actions -->
        <div class="home-actions-pill flex items-center gap-1 sm:gap-2">
          <!-- Language Switcher -->
          <LocaleSwitcher class="home-locale-switcher" />

          <!-- Doc Link -->
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-white"
            :title="t('home.viewDocs')"
          >
            <Icon name="book" size="md" />
          </a>

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-white"
            :title="isDark ? t('home.switchToLight') : t('home.switchToDark')"
          >
            <Icon v-if="isDark" name="sun" size="md" />
            <Icon v-else name="moon" size="md" />
          </button>

          <!-- Login / Dashboard Button -->
          <router-link
            v-if="isAuthenticated"
            :to="dashboardPath"
            class="home-account-button inline-flex items-center gap-1.5 py-1 pl-1 pr-2.5"
          >
            <span
              class="home-account-avatar flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
            >
              {{ userInitial }}
            </span>
            <span class="home-account-label text-xs font-medium">{{ t('home.dashboard') }}</span>
            <svg
              class="home-account-arrow h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </router-link>
          <router-link
            v-else
            to="/login"
            class="home-account-button inline-flex items-center px-3 py-1 text-xs font-medium"
          >
            {{ t('home.login') }}
          </router-link>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <div class="mx-auto max-w-6xl">
        <!-- Hero Section - Left/Right Layout -->
        <div class="mb-12 flex flex-col items-center justify-between gap-12 lg:flex-row lg:gap-16">
          <!-- Left: Text Content -->
          <div class="flex-1 text-center lg:text-left">
            <h1
              class="home-hero-title mb-4 text-4xl font-semibold md:text-5xl lg:text-6xl"
            >
              {{ siteName }}
            </h1>
            <p class="home-copy mb-8 max-w-2xl text-lg md:text-xl">
              {{ siteSubtitle }}
            </p>

            <!-- CTA Button -->
            <div>
              <router-link
                :to="isAuthenticated ? dashboardPath : '/login'"
                class="btn btn-primary home-primary-action px-8 py-3 text-base"
              >
                {{ isAuthenticated ? t('home.goToDashboard') : t('home.getStarted') }}
                <Icon name="arrowRight" size="md" class="ml-2" :stroke-width="2" />
              </router-link>
            </div>
          </div>

          <!-- Right: Terminal Animation -->
          <div class="flex flex-1 justify-center lg:justify-end">
            <div class="terminal-container">
              <div class="terminal-window">
                <!-- Window header -->
                <div class="terminal-header">
                  <div class="terminal-buttons">
                    <span class="btn-close"></span>
                    <span class="btn-minimize"></span>
                    <span class="btn-maximize"></span>
                  </div>
                  <span class="terminal-title">terminal</span>
                </div>
                <!-- Terminal content -->
                <div class="terminal-body">
                  <div class="code-line line-1">
                    <span class="code-prompt">$</span>
                    <span class="code-cmd">curl</span>
                    <span class="code-flag">-X POST</span>
                    <span class="code-url">/v1/messages</span>
                  </div>
                  <div class="code-line line-2">
                    <span class="code-comment"># Routing to upstream...</span>
                  </div>
                  <div class="code-line line-3">
                    <span class="code-success">200 OK</span>
                    <span class="code-response">{ "content": "Hello!" }</span>
                  </div>
                  <div class="code-line line-4">
                    <span class="code-prompt">$</span>
                    <span class="cursor"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature Tags - Centered -->
        <div class="mb-12 flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <div class="home-glass-chip inline-flex items-center gap-2.5 px-4 py-2">
            <Icon name="swap" size="sm" class="home-tag-icon" />
            <span class="home-label text-sm font-medium">{{
              t('home.tags.subscriptionToApi')
            }}</span>
          </div>
          <div class="home-glass-chip inline-flex items-center gap-2.5 px-4 py-2">
            <Icon name="shield" size="sm" class="home-tag-icon" />
            <span class="home-label text-sm font-medium">{{
              t('home.tags.stickySession')
            }}</span>
          </div>
          <div class="home-glass-chip inline-flex items-center gap-2.5 px-4 py-2">
            <Icon name="chart" size="sm" class="home-tag-icon" />
            <span class="home-label text-sm font-medium">{{
              t('home.tags.realtimeBilling')
            }}</span>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="mb-12 grid gap-6 md:grid-cols-3">
          <!-- Feature 1: Unified Gateway -->
          <div
            class="group rounded-2xl border border-gray-200/50 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 dark:border-dark-700/50 dark:bg-dark-800/60"
          >
            <div
              class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110"
            >
              <Icon name="server" size="lg" class="text-white" />
            </div>
            <h3 class="home-section-title mb-2 text-lg font-semibold">
              {{ t('home.features.unifiedGateway') }}
            </h3>
            <p class="home-copy text-sm leading-relaxed">
              {{ t('home.features.unifiedGatewayDesc') }}
            </p>
          </div>

          <!-- Feature 2: Account Pool -->
          <div
            class="group rounded-2xl border border-gray-200/50 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 dark:border-dark-700/50 dark:bg-dark-800/60"
          >
            <div
              class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 transition-transform group-hover:scale-110"
            >
              <svg
                class="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <h3 class="home-section-title mb-2 text-lg font-semibold">
              {{ t('home.features.multiAccount') }}
            </h3>
            <p class="home-copy text-sm leading-relaxed">
              {{ t('home.features.multiAccountDesc') }}
            </p>
          </div>

          <!-- Feature 3: Billing & Quota -->
          <div
            class="group rounded-2xl border border-gray-200/50 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 dark:border-dark-700/50 dark:bg-dark-800/60"
          >
            <div
              class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-110"
            >
              <svg
                class="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
            </div>
            <h3 class="home-section-title mb-2 text-lg font-semibold">
              {{ t('home.features.balanceQuota') }}
            </h3>
            <p class="home-copy text-sm leading-relaxed">
              {{ t('home.features.balanceQuotaDesc') }}
            </p>
          </div>
        </div>

        <!-- Supported Providers -->
        <div class="mb-8 text-center">
          <h2 class="home-section-title mb-3 text-2xl font-bold">
            {{ t('home.providers.title') }}
          </h2>
          <p class="home-copy text-sm">
            {{ t('home.providers.description') }}
          </p>
        </div>

        <div class="mb-16 flex flex-wrap items-center justify-center gap-4">
          <!-- Claude - Supported -->
          <div
            class="flex items-center gap-2 rounded-xl border border-primary-200 bg-white/60 px-5 py-3 ring-1 ring-primary-500/20 backdrop-blur-sm dark:border-primary-800 dark:bg-dark-800/60"
          >
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-500"
            >
              <span class="text-xs font-bold text-white">C</span>
            </div>
            <span class="home-label text-sm font-medium">{{ t('home.providers.claude') }}</span>
            <span class="home-status-badge">{{ t('home.providers.supported') }}</span>
          </div>
          <!-- GPT - Supported -->
          <div
            class="flex items-center gap-2 rounded-xl border border-primary-200 bg-white/60 px-5 py-3 ring-1 ring-primary-500/20 backdrop-blur-sm dark:border-primary-800 dark:bg-dark-800/60"
          >
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600"
            >
              <span class="text-xs font-bold text-white">G</span>
            </div>
            <span class="home-label text-sm font-medium">GPT</span>
            <span class="home-status-badge">{{ t('home.providers.supported') }}</span>
          </div>
          <!-- Gemini - Supported -->
          <div
            class="flex items-center gap-2 rounded-xl border border-primary-200 bg-white/60 px-5 py-3 ring-1 ring-primary-500/20 backdrop-blur-sm dark:border-primary-800 dark:bg-dark-800/60"
          >
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600"
            >
              <span class="text-xs font-bold text-white">G</span>
            </div>
            <span class="home-label text-sm font-medium">{{ t('home.providers.gemini') }}</span>
            <span class="home-status-badge">{{ t('home.providers.supported') }}</span>
          </div>
          <!-- Antigravity - Supported -->
          <div
            class="flex items-center gap-2 rounded-xl border border-primary-200 bg-white/60 px-5 py-3 ring-1 ring-primary-500/20 backdrop-blur-sm dark:border-primary-800 dark:bg-dark-800/60"
          >
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600"
            >
              <span class="text-xs font-bold text-white">A</span>
            </div>
            <span class="home-label text-sm font-medium">{{ t('home.providers.antigravity') }}</span>
            <span class="home-status-badge">{{ t('home.providers.supported') }}</span>
          </div>
          <!-- More - Coming Soon -->
          <div
            class="flex items-center gap-2 rounded-xl border border-gray-200/50 bg-white/40 px-5 py-3 opacity-60 backdrop-blur-sm dark:border-dark-700/50 dark:bg-dark-800/40"
          >
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-500 to-gray-600"
            >
              <span class="text-xs font-bold text-white">+</span>
            </div>
            <span class="home-label text-sm font-medium">{{ t('home.providers.more') }}</span>
            <span class="home-status-badge home-status-badge-muted">{{ t('home.providers.soon') }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-gray-200/50 px-6 py-8 dark:border-dark-800/50">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left"
      >
        <p class="home-muted text-sm">
          &copy; {{ currentYear }} {{ siteName }}. {{ t('home.footer.allRightsReserved') }}
        </p>
        <div class="flex items-center gap-4">
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="home-footer-link text-sm"
          >
            {{ t('home.docs') }}
          </a>
          <a
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="home-footer-link text-sm"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore, useAppStore } from '@/stores'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import Icon from '@/components/icons/Icon.vue'
import { sanitizeUrl } from '@/utils/url'

const { t } = useI18n()

const authStore = useAuthStore()
const appStore = useAppStore()

// Site settings - directly from appStore (already initialized from injected config)
const siteName = computed(() => appStore.cachedPublicSettings?.site_name || appStore.siteName || 'Sub2API')
const siteSubtitle = computed(() => appStore.cachedPublicSettings?.site_subtitle || 'AI API Gateway Platform')
const docUrl = computed(() => sanitizeUrl(appStore.cachedPublicSettings?.doc_url || appStore.docUrl || ''))
const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')

// Check if homeContent is a URL (for iframe display)
const isHomeContentUrl = computed(() => {
  const content = homeContent.value.trim()
  return content.startsWith('http://') || content.startsWith('https://')
})

// Theme
const isDark = ref(document.documentElement.classList.contains('dark'))

// GitHub URL
const githubUrl = 'https://github.com/Wei-Shaw/sub2api'

// Auth state
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const dashboardPath = computed(() => isAdmin.value ? '/admin/dashboard' : '/dashboard')
const userInitial = computed(() => {
  const user = authStore.user
  if (!user || !user.email) return ''
  return user.email.charAt(0).toUpperCase()
})

// Current year for footer
const currentYear = computed(() => new Date().getFullYear())

// Toggle theme
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Initialize theme
function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
}

onMounted(() => {
  initTheme()

  // Check auth state
  authStore.checkAuth()

  // Ensure public settings are loaded (will use cache if already loaded from injected config)
  if (!appStore.publicSettingsLoaded) {
    appStore.fetchPublicSettings()
  }
})
</script>

<style scoped>
.home-shell {
  --home-glass-fill: rgba(255, 255, 255, 0.72);
  --home-glass-strong: rgba(255, 255, 255, 0.88);
  --home-glass-muted: rgba(247, 249, 255, 0.82);
  --home-sheen: rgba(255, 255, 255, 0.88);
  --home-terminal-start: rgba(255, 255, 255, 0.82);
  --home-terminal-end: rgba(230, 245, 255, 0.74);
  --home-terminal-ink: #22354d;
  --home-terminal-muted: #526984;
  isolation: isolate;
  color: var(--ui-ink, #2e2c4f);
  background:
    linear-gradient(
      145deg,
      var(--ui-canvas, #fbfcff) 0%,
      color-mix(in srgb, var(--ui-accent-soft, #e8f7ff) 38%, var(--ui-canvas, #fbfcff)) 48%,
      color-mix(in srgb, var(--ui-primary-soft, #e7f5ff) 36%, var(--ui-canvas, #fbfcff)) 100%
    );
}

:global(html.dark) .home-shell {
  --home-glass-fill: rgba(38, 39, 70, 0.58);
  --home-glass-strong: rgba(47, 48, 83, 0.7);
  --home-glass-muted: rgba(34, 36, 64, 0.5);
  --home-sheen: rgba(236, 233, 255, 0.14);
  --home-terminal-start: rgba(38, 37, 73, 0.94);
  --home-terminal-end: rgba(25, 31, 60, 0.96);
  --home-terminal-ink: #faf9ff;
  --home-terminal-muted: #b8bdd7;
  --home-glass-button-ink: #263044;
  --home-glass-button-ink-strong: #172136;
  --home-glass-button-icon: #177ebf;
}

.home-background-grid {
  opacity: 0.78;
  background-image:
    linear-gradient(
      color-mix(in srgb, var(--ui-primary, #2498f2) 9%, transparent) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--ui-accent, #73a5df) 9%, transparent) 1px,
      transparent 1px
    );
  background-size: 64px 64px;
  mask-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.92), transparent 82%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.92), transparent 82%);
}

.home-nav-shell {
  min-height: 3.5rem;
}

.home-actions-pill {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border-radius: 999px;
}

.home-brand-pill {
  max-width: min(24rem, 58vw);
  padding: 0.2rem 0.35rem 0.2rem 0;
  border-radius: 999px;
  color: var(--ui-ink, #23354d);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;
}

.home-brand-pill:hover {
  transform: translateY(-1px);
}

.home-brand-pill:hover .home-brand-name {
  color: var(--ui-primary-strong, #0c78d8);
}

.home-actions-pill {
  border: 0;
  padding: 0.28rem;
  background:
    radial-gradient(circle at 18% 0%, rgba(255, 255, 255, 0.98), transparent 42%),
    radial-gradient(circle at 88% 110%, rgba(134, 212, 255, 0.18), transparent 56%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.68), color-mix(in srgb, var(--home-glass-fill) 78%, transparent));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    inset 0 -1px 0 rgba(86, 170, 232, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.28),
    0 14px 32px rgba(54, 111, 166, 0.09);
  backdrop-filter: blur(24px) saturate(1.35);
  -webkit-backdrop-filter: blur(24px) saturate(1.35);
}

.home-actions-pill::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.82), transparent 48%, rgba(151, 218, 255, 0.1));
  opacity: 0.64;
}

.home-actions-pill > * {
  position: relative;
  z-index: 1;
}

.home-brand-name {
  color: var(--ui-ink, #23354d);
  letter-spacing: -0.01em;
}

.home-brand-subtitle {
  max-width: 15rem;
  color: color-mix(in srgb, var(--ui-muted, #60738f) 86%, transparent);
  line-height: 1.1;
}

.home-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.home-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border: 0;
  border-radius: 999px;
  padding: 0;
  color: var(--ui-muted, #6e6b86);
  background:
    radial-gradient(circle at 28% 16%, rgba(255, 255, 255, 0.76), transparent 38%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.28), rgba(213, 239, 255, 0.18));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    inset 0 -1px 0 rgba(91, 171, 228, 0.08),
    0 5px 14px rgba(54, 111, 166, 0.06);
  backdrop-filter: blur(18px) saturate(1.35);
  -webkit-backdrop-filter: blur(18px) saturate(1.35);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.home-icon-button::before,
:deep(.home-locale-switcher > button)::before {
  content: '';
  position: absolute;
  inset: 1px;
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.62), transparent 42%),
    radial-gradient(circle at 74% 82%, rgba(125, 211, 252, 0.18), transparent 48%);
  opacity: 0.64;
  transition: opacity 0.2s ease;
}

.home-icon-button > *,
:deep(.home-locale-switcher > button > *) {
  position: relative;
  z-index: 1;
}

.home-icon-button:hover {
  color: var(--ui-primary-strong, #0c78d8);
  background:
    radial-gradient(circle at 26% 14%, rgba(255, 255, 255, 0.9), transparent 40%),
    radial-gradient(circle at 78% 92%, rgba(125, 211, 252, 0.24), transparent 52%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.54), rgba(212, 239, 255, 0.36));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.86),
    inset 0 -1px 0 rgba(91, 171, 228, 0.13),
    0 9px 22px rgba(54, 111, 166, 0.11);
  transform: translateY(-1px);
}

.home-icon-button:focus-visible,
.home-brand-pill:focus-visible,
.home-account-button:focus-visible,
.home-primary-action:focus-visible,
.home-footer-link:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ui-primary, #2498f2) 66%, transparent);
  outline-offset: 2px;
}

:deep(.home-locale-switcher > button) {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  min-height: 2.25rem;
  border: 0;
  border-radius: 999px;
  color: var(--ui-muted, #6e6b86);
  background:
    radial-gradient(circle at 28% 16%, rgba(255, 255, 255, 0.76), transparent 38%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.28), rgba(213, 239, 255, 0.18));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    inset 0 -1px 0 rgba(91, 171, 228, 0.08),
    0 5px 14px rgba(54, 111, 166, 0.06);
  backdrop-filter: blur(18px) saturate(1.35);
  -webkit-backdrop-filter: blur(18px) saturate(1.35);
}

:deep(.home-locale-switcher > button:hover) {
  color: var(--ui-primary-strong, #0c78d8);
  background:
    radial-gradient(circle at 26% 14%, rgba(255, 255, 255, 0.9), transparent 40%),
    radial-gradient(circle at 78% 92%, rgba(125, 211, 252, 0.24), transparent 52%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.54), rgba(212, 239, 255, 0.36));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.86),
    inset 0 -1px 0 rgba(91, 171, 228, 0.13),
    0 9px 22px rgba(54, 111, 166, 0.11);
}

:deep(.home-locale-switcher .absolute) {
  border-color: var(--ui-border, rgba(125, 112, 223, 0.2));
  border-radius: 8px;
  background: var(--ui-surface-strong, rgba(255, 255, 255, 0.9));
  box-shadow: var(--ui-shadow-hover, 0 16px 36px rgba(77, 68, 137, 0.18));
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
}

.home-account-button {
  min-height: 2rem;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border: 0;
  border-radius: 999px;
  color: var(--ui-primary-strong, #0c78d8);
  background:
    radial-gradient(circle at 18% 10%, rgba(255, 255, 255, 0.96), transparent 40%),
    radial-gradient(circle at 88% 110%, rgba(99, 196, 255, 0.22), transparent 58%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.58), rgba(214, 240, 255, 0.44));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(86, 170, 232, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.28),
    0 10px 24px color-mix(in srgb, var(--ui-primary, #2498f2) 12%, transparent);
  backdrop-filter: blur(22px) saturate(1.55);
  -webkit-backdrop-filter: blur(22px) saturate(1.55);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.home-account-button::before,
.home-account-button::after,
.home-primary-action::before,
.home-primary-action::after {
  content: '';
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}

.home-account-button::before,
.home-primary-action::before {
  inset: 1px;
  background:
    linear-gradient(125deg, rgba(255, 255, 255, 0.76) 0%, rgba(255, 255, 255, 0.18) 38%, transparent 58%),
    linear-gradient(315deg, rgba(112, 205, 255, 0.16), transparent 44%);
  opacity: 0.72;
}

.home-account-button::after,
.home-primary-action::after {
  width: 3.2rem;
  height: 3.2rem;
  left: 12%;
  top: -2.1rem;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.38) 34%, transparent 70%);
  filter: blur(0.5px);
  opacity: 0.72;
  transform: rotate(-18deg);
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

@media (max-width: 640px) {
  .home-nav-shell {
    flex-wrap: wrap;
  }

  .home-brand-pill {
    max-width: min(100%, 18rem);
    padding: 0.12rem 0.25rem 0.12rem 0;
  }

  .home-actions-pill {
    margin-left: auto;
  }
}

.home-account-button:hover {
  background:
    radial-gradient(circle at 18% 10%, rgba(255, 255, 255, 1), transparent 42%),
    radial-gradient(circle at 86% 108%, rgba(99, 196, 255, 0.32), transparent 60%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.68), rgba(199, 232, 255, 0.52));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 -1px 0 rgba(86, 170, 232, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.34),
    0 14px 30px color-mix(in srgb, var(--ui-primary, #2498f2) 16%, transparent);
  transform: translateY(-1px);
}

.home-account-button:hover::after,
.home-primary-action:hover::after {
  opacity: 0.92;
  transform: translateX(0.35rem) rotate(-10deg);
}

.home-account-avatar {
  border-radius: 6px;
  color: var(--ui-primary-strong, #0c78d8);
  background:
    radial-gradient(circle at 30% 18%, rgba(255, 255, 255, 0.96), transparent 44%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.74), rgba(207, 236, 255, 0.54));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.86),
    0 3px 8px rgba(54, 111, 166, 0.12);
}

.home-account-label,
.home-account-arrow {
  color: currentColor;
}

.home-hero-title,
.home-section-title {
  color: var(--ui-ink, #2e2c4f);
}

.home-hero-title {
  overflow-wrap: anywhere;
  text-wrap: balance;
  text-shadow: 0 1px 0 var(--ui-highlight, rgba(255, 255, 255, 0.62));
}

.home-copy {
  color: var(--ui-muted, #6e6b86);
}

.home-label {
  color: color-mix(in srgb, var(--ui-ink, #2e2c4f) 86%, var(--ui-muted, #6e6b86));
}

.home-muted {
  color: var(--ui-muted, #77748e);
}

.btn-primary.home-primary-action {
  max-width: 100%;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border: 0;
  border-radius: 999px;
  color: var(--ui-primary-strong, #0c78d8);
  text-align: center;
  white-space: normal;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.74);
  background:
    radial-gradient(circle at 20% 8%, rgba(255, 255, 255, 0.98), transparent 42%),
    radial-gradient(circle at 82% 115%, rgba(88, 183, 255, 0.32), transparent 60%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.68), rgba(199, 232, 255, 0.54) 56%, rgba(235, 248, 255, 0.72));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 -1px 0 rgba(69, 151, 214, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.34),
    0 18px 42px color-mix(in srgb, var(--ui-primary, #2498f2) 18%, transparent),
    0 6px 16px rgba(151, 196, 230, 0.12);
  backdrop-filter: blur(26px) saturate(1.7);
  -webkit-backdrop-filter: blur(26px) saturate(1.7);
}

.btn-primary.home-primary-action:hover {
  color: var(--ui-primary-strong, #0c78d8);
  background:
    radial-gradient(circle at 20% 8%, rgba(255, 255, 255, 1), transparent 44%),
    radial-gradient(circle at 82% 114%, rgba(88, 183, 255, 0.42), transparent 62%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(186, 226, 255, 0.62) 58%, rgba(242, 251, 255, 0.78));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 0 rgba(69, 151, 214, 0.22),
    inset 0 0 0 1px rgba(255, 255, 255, 0.42),
    0 22px 48px color-mix(in srgb, var(--ui-primary, #2498f2) 22%, transparent),
    0 8px 18px rgba(151, 196, 230, 0.16);
  transform: translateY(-2px);
}

.btn-primary.home-primary-action:active,
.home-account-button:active,
.home-icon-button:active,
:deep(.home-locale-switcher > button:active) {
  transform: translateY(0) scale(0.985);
}

:global(html.dark) .home-icon-button,
:global(html.dark) :deep(.home-locale-switcher > button) {
  color: var(--home-glass-button-ink, #263044);
  font-weight: 600;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.58);
  background:
    radial-gradient(circle at 28% 16%, rgba(255, 255, 255, 0.72), transparent 38%),
    linear-gradient(145deg, rgba(248, 252, 255, 0.64), rgba(209, 233, 250, 0.46));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.74),
    inset 0 -1px 0 rgba(124, 200, 255, 0.14),
    0 8px 20px rgba(2, 8, 23, 0.18);
}

:global(html.dark) :deep(.home-locale-switcher > button *) {
  color: inherit;
}

:global(html.dark) .home-actions-pill > a:not(.home-account-button),
:global(html.dark) .home-actions-pill > button {
  color: var(--home-glass-button-ink, #263044);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
}

:global(html.dark) .home-icon-button:hover,
:global(html.dark) :deep(.home-locale-switcher > button:hover),
:global(html.dark) .home-actions-pill > a:not(.home-account-button):hover,
:global(html.dark) .home-actions-pill > button:hover {
  color: var(--home-glass-button-ink-strong, #172136);
}

:global(html.dark) .home-account-button,
:global(html.dark) .btn-primary.home-primary-action {
  color: var(--home-glass-button-ink-strong, #172136);
  font-weight: 650;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.62);
  background:
    radial-gradient(circle at 18% 10%, rgba(255, 255, 255, 0.86), transparent 42%),
    radial-gradient(circle at 86% 108%, rgba(124, 200, 255, 0.34), transparent 60%),
    linear-gradient(135deg, rgba(247, 251, 255, 0.76), rgba(174, 214, 242, 0.72));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.84),
    inset 0 -1px 0 rgba(124, 200, 255, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.18),
    0 18px 42px rgba(2, 8, 23, 0.28);
}

:global(html.dark) .home-account-button .home-account-arrow,
:global(html.dark) .btn-primary.home-primary-action svg {
  color: var(--home-glass-button-icon, #177ebf);
  filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.42));
}

:global(html.dark) .home-account-avatar {
  color: var(--home-glass-button-icon, #177ebf);
}

:global(html.dark) .home-glass-chip .home-label {
  color: var(--home-glass-button-ink-strong, #172136);
  font-weight: 650;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.58);
}

:global(html.dark) .home-glass-chip .home-tag-icon {
  color: var(--home-glass-button-icon, #177ebf);
  filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.42));
}

.home-glass-chip,
.home-feature-card,
.home-provider-chip {
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid var(--ui-border, rgba(125, 112, 223, 0.2));
  background: linear-gradient(135deg, var(--home-glass-strong), var(--home-glass-fill));
  box-shadow:
    inset 0 1px 0 var(--ui-highlight, rgba(255, 255, 255, 0.72)),
    var(--ui-shadow, 0 12px 32px rgba(77, 68, 137, 0.12));
  backdrop-filter: blur(26px) saturate(1.5);
  -webkit-backdrop-filter: blur(26px) saturate(1.5);
}

.home-glass-chip::before,
.home-feature-card::before,
.home-provider-chip::before {
  content: '';
  position: absolute;
  z-index: 0;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    118deg,
    var(--home-sheen) 0%,
    transparent 38%,
    color-mix(in srgb, var(--ui-accent-soft, #e7efff) 22%, transparent) 100%
  );
  opacity: 0.62;
}

.home-glass-chip > *,
.home-feature-card > *,
.home-provider-chip > * {
  position: relative;
  z-index: 1;
}

.home-feature-card,
.home-provider-chip {
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background-color 0.22s ease;
}

.home-feature-card:hover,
.home-provider-chip:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--ui-primary, #2498f2) 34%, transparent);
  background: linear-gradient(135deg, var(--home-glass-strong), var(--home-glass-muted));
  box-shadow:
    inset 0 1px 0 var(--home-sheen),
    var(--ui-shadow-hover, 0 18px 40px rgba(77, 68, 137, 0.18));
}

.home-tag-icon {
  color: var(--ui-primary-strong, #0c78d8);
}

.home-icon-tile,
.home-provider-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid color-mix(in srgb, var(--ui-primary, #2498f2) 24%, transparent);
  color: var(--ui-primary-strong, #0c78d8);
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--ui-primary-soft, #e7f5ff) 74%, var(--home-glass-strong)),
    color-mix(in srgb, var(--ui-accent-soft, #e7efff) 72%, var(--home-glass-fill))
  );
  box-shadow:
    inset 0 1px 0 var(--home-sheen),
    0 8px 18px color-mix(in srgb, var(--ui-primary, #2498f2) 15%, transparent);
}

.home-icon-tile {
  width: 3rem;
  height: 3rem;
  border-radius: 8px;
  transition: transform 0.22s ease;
}

.home-feature-card:hover .home-icon-tile {
  transform: scale(1.04);
}

.home-feature-card:nth-child(2) .home-icon-tile {
  color: var(--ui-accent, #73a5df);
  background: color-mix(in srgb, var(--ui-accent-soft, #e7efff) 76%, var(--home-glass-strong));
}

.home-feature-card:nth-child(3) .home-icon-tile {
  color: color-mix(in srgb, var(--ui-primary-strong, #0c78d8) 72%, var(--ui-accent, #48b2ec));
}

.home-provider-mark {
  width: 2rem;
  height: 2rem;
  border-radius: 7px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0;
}

.home-provider-mark-muted {
  color: var(--ui-muted, #77748e);
  background: var(--ui-surface-muted, #eeeff8);
}

.home-provider-chip:nth-child(2) .home-provider-mark {
  color: var(--ui-accent, #73a5df);
}

.home-provider-chip:nth-child(3) .home-provider-mark {
  color: color-mix(in srgb, var(--ui-primary, #2498f2) 58%, var(--ui-accent, #48b2ec));
}

.home-provider-chip:nth-child(4) .home-provider-mark {
  color: var(--ui-primary, #2498f2);
}

.home-status-badge {
  border: 1px solid color-mix(in srgb, var(--ui-accent, #73a5df) 22%, transparent);
  border-radius: 6px;
  padding: 0.125rem 0.375rem;
  font-size: 10px;
  font-weight: 600;
  color: color-mix(in srgb, var(--ui-accent, #73a5df) 62%, var(--ui-ink, #2e2c4f));
  background: var(--ui-accent-soft, #e7efff);
}

.home-status-badge-muted {
  border-color: var(--ui-border, rgba(125, 112, 223, 0.2));
  color: var(--ui-muted, #77748e);
  background: var(--ui-surface-muted, #eeeff8);
}

.home-footer-link {
  border-radius: 4px;
  color: var(--ui-muted, #77748e);
  transition: color 0.2s ease;
}

.home-footer-link:hover {
  color: var(--ui-primary-strong, #0c78d8);
}

/* Terminal Container */
.terminal-container {
  position: relative;
  display: inline-block;
}

/* Terminal Window */
.terminal-window {
  width: min(420px, calc(100vw - 3rem));
  position: relative;
  border: 1px solid rgba(132, 184, 229, 0.36);
  border-radius: 18px;
  background: linear-gradient(145deg, var(--home-terminal-start), var(--home-terminal-end));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    inset 0 -1px 0 rgba(255, 255, 255, 0.36),
    0 28px 64px -30px rgba(27, 80, 132, 0.42),
    0 10px 22px -18px rgba(72, 178, 236, 0.32);
  backdrop-filter: blur(30px) saturate(1.65);
  -webkit-backdrop-filter: blur(30px) saturate(1.65);
  overflow: hidden;
  transform: perspective(1000px) rotateX(1.5deg) rotateY(-1.5deg);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

 :global(html.dark) .terminal-window {
  border-color: rgba(154, 215, 255, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 24px 48px -20px rgba(4, 21, 43, 0.58);
 }

.terminal-window::before {
  content: '';
  position: absolute;
  z-index: 0;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    125deg,
    rgba(255, 255, 255, 0.62) 0%,
    rgba(255, 255, 255, 0.16) 34%,
    rgba(116, 194, 255, 0.12) 100%
  );
}

.terminal-window:hover {
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-4px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.94),
    inset 0 -1px 0 rgba(255, 255, 255, 0.38),
    0 34px 70px -30px rgba(27, 80, 132, 0.48);
}

/* Terminal Header */
.terminal-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(132, 184, 229, 0.18);
  background: rgba(255, 255, 255, 0.26);
}

.terminal-buttons {
  display: flex;
  gap: 8px;
}

.terminal-buttons span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.btn-close {
  background: #ff7c8a;
}
.btn-minimize {
  background: #7fc4ff;
}
.btn-maximize {
  background: #8be4c3;
}

.terminal-title {
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-family: ui-monospace, monospace;
  color: #5c7898;
  margin-right: 52px;
}

/* Terminal Body */
.terminal-body {
  position: relative;
  z-index: 1;
  padding: 20px 24px;
  font-family: ui-monospace, 'Fira Code', monospace;
  font-size: 14px;
  line-height: 2;
}

.code-line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  opacity: 0;
  animation: line-appear 0.5s ease forwards;
}

.line-1 {
  animation-delay: 0.3s;
}
.line-2 {
  animation-delay: 1s;
}
.line-3 {
  animation-delay: 1.8s;
}
.line-4 {
  animation-delay: 2.5s;
}

@keyframes line-appear {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.code-prompt {
  color: #0c78d8;
  font-weight: bold;
}
.code-cmd {
  color: var(--home-terminal-ink);
  font-weight: 650;
}
.code-flag {
  color: #1f75a7;
  font-weight: 600;
}
.code-url {
  color: #316da8;
  font-weight: 600;
}
.code-comment {
  color: var(--home-terminal-muted);
  font-style: italic;
}
.code-success {
  border: 1px solid rgba(53, 154, 231, 0.28);
  color: #075f9f;
  background: rgba(215, 239, 255, 0.86);
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 700;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
.code-response {
  color: #4a5f79;
  font-weight: 520;
}

:global(html.dark) .terminal-title {
  color: #b6d9f5;
}

:global(html.dark) .code-prompt,
:global(html.dark) .code-flag,
:global(html.dark) .code-url {
  color: #9ad7ff;
}

:global(html.dark) .code-success {
  border-color: rgba(154, 215, 255, 0.28);
  color: #dff4ff;
  background: rgba(36, 152, 242, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

:global(html.dark) .code-response {
  color: #d6eaff;
}

/* Blinking Cursor */
.cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: #0c78d8;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* Dark mode adjustments */
:global(html.dark) .terminal-window {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 24px 48px -20px rgba(4, 21, 43, 0.68);
}

/* Final dark-mode contrast guard for light glass controls on /home. */
:global(html.dark) .home-shell span.home-label.text-sm.font-medium {
  color: #111827 !important;
  font-weight: 700 !important;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.72) !important;
}

:global(html.dark) .home-shell span.home-account-label.text-xs.font-medium,
:global(html.dark) .home-shell .home-account-button,
:global(html.dark) .home-shell a.btn.btn-primary.home-primary-action.px-8.py-3.text-base {
  color: #111827 !important;
  font-weight: 700 !important;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.72) !important;
}

:global(html.dark) .home-shell .home-tag-icon,
:global(html.dark) .home-shell .home-account-arrow,
:global(html.dark) .home-shell a.btn.btn-primary.home-primary-action.px-8.py-3.text-base svg {
  color: #075985 !important;
  stroke: currentColor !important;
  filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.48)) !important;
}

:global(html.dark) .home-shell .home-actions-pill > a:not(.home-account-button),
:global(html.dark) .home-shell .home-actions-pill > button,
:global(html.dark) .home-shell :deep(.home-locale-switcher > button),
:global(html.dark) .home-shell :deep(.home-locale-switcher > button *) {
  color: #1f2937 !important;
  font-weight: 700 !important;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.66) !important;
}

:global(html.dark) .home-shell .home-actions-pill > a:not(.home-account-button) svg,
:global(html.dark) .home-shell .home-actions-pill > button svg {
  color: #075985 !important;
  stroke: currentColor !important;
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .home-actions-pill,
  .home-glass-chip,
  .home-feature-card,
  .home-provider-chip {
    background: var(--ui-surface-strong, #ffffff);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-icon-button,
  .home-account-button,
  .home-primary-action,
  .home-feature-card,
  .home-provider-chip,
  .home-icon-tile,
  .terminal-window,
  .code-line,
  .cursor {
    animation: none;
    transition: none;
    transform: none;
  }

  .code-line {
    opacity: 1;
  }
}
</style>
