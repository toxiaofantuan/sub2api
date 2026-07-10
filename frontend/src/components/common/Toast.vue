<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed right-4 top-4 z-[9999] space-y-2"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-2 scale-[0.98]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-[0.98]"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast-card pointer-events-auto min-w-[300px] max-w-sm overflow-hidden rounded-md'
          ]"
        >
          <div class="px-4 py-3">
            <div class="flex items-start gap-3">
              <!-- Icon -->
              <div :class="['mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md', getIconShellClass(toast.type)]">
                <Icon
                  :name="getToastIconName(toast.type)"
                  size="sm"
                  :class="getIconColor(toast.type)"
                  aria-hidden="true"
                />
              </div>

              <!-- Content -->
              <div class="min-w-0 flex-1">
                <p v-if="toast.title" class="toast-title text-sm font-semibold">
                  {{ toast.title }}
                </p>
                <p
                  :class="[
                    'text-sm leading-relaxed',
                    toast.title
                      ? 'toast-message-muted mt-1'
                      : 'toast-message'
                  ]"
                >
                  {{ toast.message }}
                </p>
              </div>

              <!-- Close button -->
              <button
                @click="removeToast(toast.id)"
                class="toast-close -m-1 flex-shrink-0 rounded-md p-1 transition-colors"
                aria-label="Close notification"
              >
                <Icon name="x" size="sm" />
              </button>
            </div>
          </div>

          <!-- Progress bar -->
          <div v-if="toast.duration" class="toast-track h-0.5">
            <div
              :class="['h-full toast-progress', getProgressBarColor(toast.type)]"
              :style="{ animationDuration: `${toast.duration}ms` }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/icons/Icon.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const toasts = computed(() => appStore.toasts)

const getToastIconName = (type: string): 'checkCircle' | 'xCircle' | 'exclamationTriangle' | 'infoCircle' => {
  switch (type) {
    case 'success':
      return 'checkCircle'
    case 'error':
      return 'xCircle'
    case 'warning':
      return 'exclamationTriangle'
    case 'info':
    default:
      return 'infoCircle'
  }
}

const getIconColor = (type: string): string => {
  const colors: Record<string, string> = {
    success: 'text-emerald-600 dark:text-emerald-300',
    error: 'text-red-600 dark:text-red-300',
    warning: 'text-amber-600 dark:text-amber-300',
    info: 'text-sky-600 dark:text-sky-300'
  }
  return colors[type] || colors.info
}

const getIconShellClass = (type: string): string => {
  const colors: Record<string, string> = {
    success: 'bg-emerald-500/10 dark:bg-emerald-400/20',
    error: 'bg-red-500/10 dark:bg-red-400/20',
    warning: 'bg-amber-500/10 dark:bg-amber-400/20',
    info: 'bg-sky-500/10 dark:bg-sky-400/20'
  }
  return colors[type] || colors.info
}

const getProgressBarColor = (type: string): string => {
  const colors: Record<string, string> = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500'
  }
  return colors[type] || colors.info
}

const removeToast = (id: string) => {
  appStore.hideToast(id)
}
</script>

<style scoped>
.toast-card {
  position: relative;
  width: min(24rem, calc(100vw - 2rem));
  border: 1px solid var(--ui-border);
  color: var(--ui-ink);
  background:
    linear-gradient(135deg, var(--ui-highlight), transparent 42%),
    var(--ui-surface-strong);
  box-shadow: var(--ui-shadow-hover);
  backdrop-filter: blur(26px) saturate(1.5);
  -webkit-backdrop-filter: blur(26px) saturate(1.5);
}

.toast-title,
.toast-message {
  color: var(--ui-ink);
}

.toast-message-muted {
  color: var(--ui-muted);
}

.toast-close {
  color: var(--ui-muted);
}

.toast-close:hover {
  color: var(--ui-primary-strong);
  background: var(--ui-primary-soft);
}

.toast-close:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ui-primary) 60%, transparent);
  outline-offset: 2px;
}

.toast-track {
  background: color-mix(in srgb, var(--ui-muted) 12%, transparent);
}

.toast-progress {
  width: 100%;
  animation-name: toast-progress-shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .toast-card {
    background: var(--ui-surface-strong);
  }
}

@media (prefers-reduced-motion: reduce) {
  .toast-progress {
    animation: none;
  }
}

@keyframes toast-progress-shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
