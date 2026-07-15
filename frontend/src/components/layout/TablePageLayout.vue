<template>
  <div class="table-page-layout" :class="{ 'mobile-mode': isMobile }">
    <!-- 固定区域：操作按钮 -->
    <div v-if="$slots.actions" class="layout-section-fixed">
      <slot name="actions" />
    </div>

    <!-- 固定区域：搜索和过滤器 -->
    <div v-if="$slots.filters" class="layout-section-fixed">
      <slot name="filters" />
    </div>

    <!-- 滚动区域：表格 -->
    <div class="layout-section-scrollable">
      <div class="card table-scroll-container">
        <slot name="table" />
      </div>
    </div>

    <!-- 固定区域：分页器 -->
    <div v-if="$slots.pagination" class="layout-section-fixed">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* 桌面端：Flexbox 布局 */
.table-page-layout {
  @apply flex flex-col gap-6;
  height: calc(100vh - 64px - 4rem); /* 减去 header + lg:p-8 的上下padding */
}

.layout-section-fixed {
  @apply flex-shrink-0;
}

.layout-section-scrollable {
  @apply flex-1 min-h-0 flex flex-col;
}

/* 表格滚动容器 - 增强版表体滚动方案 */
.table-scroll-container {
  @apply flex flex-col overflow-hidden h-full rounded-md;
  background: var(--ui-surface, rgba(255, 255, 255, 0.66));
  border: 1px solid var(--ui-border, rgba(89, 159, 221, 0.16));
  box-shadow: var(--ui-shadow, 0 16px 40px rgba(88, 76, 145, 0.12));
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
}

:global(.dark) .table-scroll-container {
  background: var(--ui-surface, rgba(35, 32, 57, 0.7));
  border-color: var(--ui-border, rgba(218, 223, 255, 0.12));
  box-shadow: var(--ui-shadow, 0 18px 44px rgba(12, 10, 28, 0.3));
}

.table-scroll-container :deep(.table-wrapper) {
  @apply flex-1 overflow-x-auto overflow-y-auto;
  /* 确保横向滚动条显示在最底部 */
  background: var(--ui-surface-strong, rgba(255, 255, 255, 0.88));
  scrollbar-gutter: stable;
}

:global(.dark) .table-scroll-container :deep(.table-wrapper) {
  background: var(--ui-surface-strong, rgba(32, 30, 52, 0.9));
}

.table-scroll-container :deep(table) {
  @apply w-full;
  min-width: max-content; /* 关键：确保表格宽度根据内容撑开，从而触发横向滚动 */
  display: table; /* 使用标准 table 布局以支持 sticky 列 */
  background: var(--ui-table-row, #ffffff);
}

:global(.dark) .table-scroll-container :deep(table) {
  background: var(--ui-table-row, #272d46);
}

.table-scroll-container :deep(thead) {
  background: var(--ui-table-header, #e4f4ff);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

:global(.dark) .table-scroll-container :deep(thead) {
  background: var(--ui-table-header, #1d2237);
}

.table-scroll-container :deep(tbody) {
  /* 保持默认 table-row-group 显示，不使用 block */
  background: var(--ui-table-row, #ffffff);
}

:global(.dark) .table-scroll-container :deep(tbody) {
  background: var(--ui-table-row, #272d46);
}

.table-scroll-container :deep(th) {
  @apply px-5 py-4 text-left text-sm font-medium text-gray-600 dark:text-dark-300 border-b border-transparent;
  background: var(--ui-table-header, #e4f4ff);
  border-color: var(--ui-border, rgba(89, 159, 221, 0.16));
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

:global(.dark) .table-scroll-container :deep(th) {
  background: var(--ui-table-header, #1d2237);
  border-color: var(--ui-border, rgba(218, 223, 255, 0.12));
}

.table-scroll-container :deep(td) {
  @apply px-5 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-transparent;
  background: var(--ui-table-row, #ffffff);
  border-color: var(--ui-table-border, rgba(94, 166, 226, 0.18));
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

:global(.dark) .table-scroll-container :deep(td) {
  background: var(--ui-table-row, #272d46);
  border-color: var(--ui-table-border, rgba(218, 223, 255, 0.08));
}

.table-scroll-container :deep(tbody tr:nth-child(even) td) {
  background: var(--ui-table-row-alt, #eff8ff);
}

:global(.dark) .table-scroll-container :deep(tbody tr:nth-child(even) td) {
  background: var(--ui-table-row-alt, #2d3452);
}

.table-scroll-container :deep(tbody tr:hover td) {
  background: var(--ui-table-hover, #d5edff);
}

:global(.dark) .table-scroll-container :deep(tbody tr:hover td) {
  background: var(--ui-table-hover, #41587e);
}

/* 移动端：恢复正常滚动 */
.table-page-layout.mobile-mode .table-scroll-container {
  @apply h-auto overflow-visible border-none shadow-none bg-transparent;
}

.table-page-layout.mobile-mode .layout-section-scrollable {
  @apply flex-none min-h-fit;
}

.table-page-layout.mobile-mode .table-scroll-container :deep(.table-wrapper) {
  @apply overflow-visible;
}

.table-page-layout.mobile-mode .table-scroll-container :deep(table) {
  @apply flex-none;
  display: table;
  min-width: 100%;
}
</style>
