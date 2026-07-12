<script setup lang="ts">
/**
 * 导航进度条组件
 * 在页面顶部显示加载进度，提供导航反馈
 */
import { computed } from 'vue'
import { useNavigationLoadingState } from '@/composables/useNavigationLoading'

const { isLoading } = useNavigationLoadingState()

// 进度条可见性
const isVisible = computed(() => isLoading.value)
</script>

<template>
  <Transition name="progress-fade">
    <div
      v-show="isVisible"
      class="navigation-progress"
      role="progressbar"
      aria-label="Loading"
      aria-valuenow="0"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="navigation-progress-bar" />
    </div>
  </Transition>
</template>

<style scoped>
.navigation-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  overflow: hidden;
  background: transparent;
}

.navigation-progress-bar {
  height: 100%;
  width: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(148, 212, 255, 0.28) 14%,
    #58b7ff 32%,
    #2498f2 50%,
    #73c9f8 68%,
    rgba(148, 212, 255, 0.28) 86%,
    transparent 100%
  ) !important;
  box-shadow:
    0 0 12px rgba(36, 152, 242, 0.35),
    0 0 24px rgba(115, 201, 248, 0.2) !important;
  animation: progress-slide 1.5s ease-in-out infinite;
}

/* 暗色模式下的进度条颜色 */
:global(.dark) .navigation-progress-bar {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(124, 200, 255, 0.24) 14%,
    #7cc8ff 32%,
    #9ad7ff 50%,
    #78d4ff 68%,
    rgba(124, 200, 255, 0.24) 86%,
    transparent 100%
  ) !important;
}

/* 进度条滑动动画 */
@keyframes progress-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 淡入淡出过渡 */
.progress-fade-enter-active {
  transition: opacity 0.15s ease-out;
}

.progress-fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .navigation-progress-bar {
    animation: progress-pulse 2s ease-in-out infinite;
  }

  @keyframes progress-pulse {
    0%,
    100% {
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
  }
}
</style>
