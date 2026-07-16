<template>
  <div v-if="!isDesktopViewport" class="mobile-table-list">
    <template v-if="loading">
      <div v-for="i in 5" :key="i" class="glass-card mobile-table-card">
        <div class="mobile-table-card-grid">
          <div
            v-for="(column, columnIndex) in dataColumns"
            :key="column.key"
            :class="getMobileCellClass(column, columnIndex)"
          >
            <div class="h-3 w-14 animate-pulse rounded bg-sky-100/80 dark:bg-dark-700"></div>
            <div class="h-4 w-full max-w-28 animate-pulse rounded bg-sky-100/80 dark:bg-dark-700"></div>
          </div>
          <div v-if="hasActionsColumn" class="mobile-table-actions">
            <div class="h-9 w-full animate-pulse rounded-xl bg-sky-100/80 dark:bg-dark-700"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="!data || data.length === 0">
      <div class="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-dark-700 dark:bg-dark-900">
        <slot name="empty">
          <div class="flex flex-col items-center">
            <Icon
              name="inbox"
              size="xl"
              class="mb-4 h-12 w-12 text-gray-400 dark:text-dark-500"
            />
            <p class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ t('empty.noData') }}
            </p>
          </div>
        </slot>
      </div>
    </template>

    <template v-else>
      <div v-if="selectable" class="flex items-center justify-end gap-2 px-1">
        <label class="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-800"
            :checked="allVisibleSelected"
            :indeterminate="someVisibleSelected"
            data-test="select-all-mobile"
            @change="toggleAllVisible(($event.target as HTMLInputElement).checked)"
          />
          <span>{{ t('common.selectAll') }}</span>
        </label>
      </div>
      <div
        v-for="(row, index) in sortedData"
        :key="resolveRowKey(row, index)"
        class="glass-card mobile-table-card"
        :class="{
          'cursor-pointer': clickableRows,
          'mobile-table-card-selected': selectable && isRowSelected(row, index)
        }"
        @click="clickableRows && emit('rowClick', row)"
      >
        <div class="mobile-table-card-grid">
          <div v-if="selectable" class="mobile-table-selection">
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-800"
              :checked="isRowSelected(row, index)"
              :aria-label="getRowSelectionLabel(row, index)"
              data-test="select-row"
              @click.stop
              @change="toggleRowSelection(row, index, ($event.target as HTMLInputElement).checked)"
            />
          </div>
          <div
            v-for="(column, columnIndex) in dataColumns"
            :key="column.key"
            :class="getMobileCellClass(column, columnIndex)"
          >
            <span class="mobile-table-label">
              {{ column.label }}
            </span>
            <div class="mobile-table-value">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :expanded="actionsExpanded">
                {{ column.formatter ? column.formatter(row[column.key], row) : row[column.key] }}
              </slot>
            </div>
          </div>
          <div v-if="hasActionsColumn" class="mobile-table-actions" @click.stop>
            <slot name="cell-actions" :row="row" :value="row['actions']" :expanded="actionsExpanded"></slot>
          </div>
        </div>
      </div>
    </template>
  </div>

  <div
    v-else
    ref="tableWrapperRef"
    class="table-wrapper"
    :class="{
      'actions-expanded': actionsExpanded,
      'is-scrollable': isScrollable
    }"
  >
    <table class="w-full min-w-max divide-y divide-gray-200 dark:divide-dark-700">
      <thead class="table-header bg-gray-50 dark:bg-dark-800">
        <tr>
          <th
            v-if="selectable"
            scope="col"
            class="sticky-header-cell w-11 min-w-11 px-3 py-3 text-center"
          >
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-800"
              :checked="allVisibleSelected"
              :indeterminate="someVisibleSelected"
              :aria-label="t('common.selectAll')"
              data-test="select-all"
              @change="toggleAllVisible(($event.target as HTMLInputElement).checked)"
            />
          </th>
          <th
            v-for="(column, index) in columns"
            :key="column.key"
            scope="col"
            :aria-sort="column.sortable ? getColumnAriaSort(column.key) : undefined"
            :class="[
              'sticky-header-cell py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-dark-400',
              getAdaptivePaddingClass(),
              { 'cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700': column.sortable },
              getStickyColumnClass(column, index),
              column.class
            ]"
            @click="column.sortable && handleSort(column.key)"
          >
            <slot
              :name="`header-${column.key}`"
              :column="column"
              :sort-key="sortKey"
              :sort-order="sortOrder"
            >
              <div :class="['flex items-center space-x-1', getHeaderContentAlignmentClass(column)]">
                <span>{{ column.label }}</span>
                <span
                  v-if="column.sortable"
                  class="inline-flex h-5 w-4 flex-col items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    class="h-2.5 w-2.5"
                    :class="getSortIndicatorClass(column.key, 'asc')"
                    fill="currentColor"
                    viewBox="0 0 10 10"
                  >
                    <path d="M5 2L1.5 6.5h7L5 2z" />
                  </svg>
                  <svg
                    class="-mt-0.5 h-2.5 w-2.5"
                    :class="getSortIndicatorClass(column.key, 'desc')"
                    fill="currentColor"
                    viewBox="0 0 10 10"
                  >
                    <path d="M5 8L1.5 3.5h7L5 8z" />
                  </svg>
                </span>
              </div>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody class="table-body divide-y divide-gray-200 bg-white dark:divide-dark-700 dark:bg-dark-900">
        <!-- Loading skeleton -->
        <tr v-if="loading" v-for="i in 5" :key="i">
          <td v-if="selectable" class="w-11 min-w-11 px-3 py-4">
            <div class="mx-auto h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-dark-700"></div>
          </td>
          <td v-for="column in columns" :key="column.key" :class="['whitespace-nowrap py-4', getAdaptivePaddingClass()]">
            <div class="animate-pulse">
              <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-dark-700"></div>
            </div>
          </td>
        </tr>

        <!-- Empty state -->
        <tr v-else-if="!data || data.length === 0">
          <td
            :colspan="tableColumnCount"
            :class="['py-12 text-center text-gray-500 dark:text-dark-400', getAdaptivePaddingClass()]"
          >
            <slot name="empty">
              <div class="flex flex-col items-center">
                <Icon
                  name="inbox"
                  size="xl"
                  class="mb-4 h-12 w-12 text-gray-400 dark:text-dark-500"
                />
                <p class="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {{ t('empty.noData') }}
                </p>
              </div>
            </slot>
          </td>
        </tr>

        <!-- Data rows: windowed when large, fully rendered when small (shared row/cell template) -->
        <template v-else>
          <tr v-if="virtualPaddingTop > 0" aria-hidden="true">
            <td :colspan="tableColumnCount"
                :style="{ height: virtualPaddingTop + 'px', padding: 0, border: 'none' }">
            </td>
          </tr>
          <tr
            v-for="item in renderRows"
            :key="resolveRowKey(item.row, item.index)"
            :data-row-id="resolveRowKey(item.row, item.index)"
            :data-index="item.index"
            :ref="item.measure ? measureElement : undefined"
            class="hover:bg-gray-50 dark:hover:bg-dark-800"
            :class="{
              'cursor-pointer': clickableRows,
              'bg-primary-50/40 dark:bg-primary-900/10': selectable && isRowSelected(item.row, item.index)
            }"
            @click="clickableRows && emit('rowClick', item.row)"
          >
            <td v-if="selectable" class="w-11 min-w-11 px-3 py-4 text-center">
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-800"
                :checked="isRowSelected(item.row, item.index)"
                :aria-label="getRowSelectionLabel(item.row, item.index)"
                data-test="select-row"
                @click.stop
                @change="toggleRowSelection(item.row, item.index, ($event.target as HTMLInputElement).checked)"
              />
            </td>
            <td
              v-for="(column, colIndex) in columns"
              :key="column.key"
              :class="[
                'whitespace-nowrap py-4 text-sm text-gray-900 dark:text-gray-100',
                getAdaptivePaddingClass(),
                getStickyColumnClass(column, colIndex),
                column.class
              ]"
            >
              <slot :name="`cell-${column.key}`"
                    :row="item.row"
                    :value="item.row[column.key]"
                    :expanded="actionsExpanded">
                {{ column.formatter
                   ? column.formatter(item.row[column.key], item.row)
                   : item.row[column.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="virtualPaddingBottom > 0" aria-hidden="true">
            <td :colspan="tableColumnCount"
                :style="{ height: virtualPaddingBottom + 'px', padding: 0, border: 'none' }">
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useVirtualizer, observeElementRect as observeElementRectDefault } from '@tanstack/vue-virtual'
import { useI18n } from 'vue-i18n'
import type { Column } from './types'
import Icon from '@/components/icons/Icon.vue'

const { t } = useI18n()

const desktopViewportQuery = '(min-width: 768px)'
const isDesktopViewport = ref(
  typeof window === 'undefined' ? true : window.matchMedia(desktopViewportQuery).matches
)

const emit = defineEmits<{
  sort: [key: string, order: 'asc' | 'desc']
  rowClick: [row: any]
  'update:selectedKeys': [keys: Array<string | number>]
  selectionChange: [keys: Array<string | number>]
}>()

// 表格容器引用
const tableWrapperRef = ref<HTMLElement | null>(null)
const isScrollable = ref(false)
const actionsColumnNeedsExpanding = ref(false)

// --- 虚拟滚动「整表空白」根治 ---
// 根因:本组件根 .table-wrapper 为 flex:1 / min-h-0,高度由父级 flex 链决定。@tanstack 虚拟化器
// 仅在 observeElementRect 回调里写 scrollRect;一旦该回调读到 0 高度(加载瞬间 flex 未结算,或
// 滚动中动态行高校正触发的 reflow),scrollRect 被钉死为 0 → calculateRange 返回 null → 整表空白。
// 对策(见下方 virtualizer 选项):
//   1) 覆写 observeElementRect,直接丢弃 height<=0 的读数,scrollRect 永不被钉成 0;
//   2) initialRect 给一屏兜底高度,首个有效读数到来前也有行可渲染,绝不空白。
// 兜底高度:表格区域大致 = 视口高度 - 顶栏/外边距/筛选/分页 ≈ 320px
const estimatedViewportHeight = () => {
  if (typeof window === 'undefined') return 600
  return Math.max(window.innerHeight - 320, 400)
}

// 覆写默认 observeElementRect:过滤掉 0 高度读数(根治整表空白的关键)
const observeElementRectNonZero = (
  instance: any,
  cb: (rect: { width: number; height: number }) => void
) => observeElementRectDefault(instance, (rect) => {
  if (rect.height > 0) cb(rect)
})

// 检查是否可滚动
const checkScrollable = () => {
  if (tableWrapperRef.value) {
    isScrollable.value = tableWrapperRef.value.scrollWidth > tableWrapperRef.value.clientWidth
  }
}

// 检查操作列是否需要展开
const checkActionsColumnWidth = () => {
  if (!props.expandableActions) {
    actionsColumnNeedsExpanding.value = false
    actionsExpanded.value = false
    return
  }
  if (!tableWrapperRef.value) return

  // 查找第一行的操作列单元格
  const firstActionCell = tableWrapperRef.value.querySelector('tbody tr:first-child td:last-child')
  if (!firstActionCell) return

  // 查找操作列内容的容器div
  const actionsContainer = firstActionCell.querySelector('div')
  if (!actionsContainer) return

  // 临时展开以测量完整宽度
  const wasExpanded = actionsExpanded.value
  actionsExpanded.value = true

  // 等待DOM更新
  nextTick(() => {
    // 测量所有按钮的总宽度
    const actionItems = actionsContainer.querySelectorAll('button, a, [role="button"]')
    if (actionItems.length <= 2) {
      actionsColumnNeedsExpanding.value = false
      actionsExpanded.value = wasExpanded
      return
    }

    // 计算所有按钮的总宽度（包括gap）
    let totalWidth = 0
    actionItems.forEach((item, index) => {
      totalWidth += (item as HTMLElement).offsetWidth
      if (index < actionItems.length - 1) {
        totalWidth += 4 // gap-1 = 4px
      }
    })

    // 获取单元格可用宽度（减去padding）
    const cellWidth = (firstActionCell as HTMLElement).clientWidth - 32 // 减去左右padding

    // 如果总宽度超过可用宽度，需要展开功能
    actionsColumnNeedsExpanding.value = totalWidth > cellWidth

    // 恢复原来的展开状态
    actionsExpanded.value = wasExpanded
  })
}

// 监听尺寸变化
let resizeObserver: ResizeObserver | null = null
let resizeHandler: (() => void) | null = null
let desktopViewportMediaQuery: MediaQueryList | null = null
let desktopViewportListener: ((event: MediaQueryListEvent) => void) | null = null

const detachDesktopTableTracking = () => {
  resizeObserver?.disconnect()
  resizeObserver = null
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
}

const attachDesktopTableTracking = () => {
  checkScrollable()
  checkActionsColumnWidth()
  if (tableWrapperRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      checkScrollable()
      checkActionsColumnWidth()
    })
    resizeObserver.observe(tableWrapperRef.value)
  } else {
    // 降级方案：不支持 ResizeObserver 时使用 window resize
    resizeHandler = () => {
      checkScrollable()
      checkActionsColumnWidth()
    }
    window.addEventListener('resize', resizeHandler)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    desktopViewportMediaQuery = window.matchMedia(desktopViewportQuery)
    isDesktopViewport.value = desktopViewportMediaQuery.matches
    desktopViewportListener = (event: MediaQueryListEvent) => {
      isDesktopViewport.value = event.matches
    }
    if (typeof desktopViewportMediaQuery.addEventListener === 'function') {
      desktopViewportMediaQuery.addEventListener('change', desktopViewportListener)
    } else {
      desktopViewportMediaQuery.addListener(desktopViewportListener)
    }
  }
})

onUnmounted(() => {
  detachDesktopTableTracking()
  if (desktopViewportMediaQuery && desktopViewportListener) {
    if (typeof desktopViewportMediaQuery.removeEventListener === 'function') {
      desktopViewportMediaQuery.removeEventListener('change', desktopViewportListener)
    } else {
      desktopViewportMediaQuery.removeListener(desktopViewportListener)
    }
    desktopViewportListener = null
  }
  desktopViewportMediaQuery = null
})

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  stickyFirstColumn?: boolean
  stickyActionsColumn?: boolean
  expandableActions?: boolean
  actionsCount?: number // 操作按钮总数，用于判断是否需要展开功能
  rowKey?: string | ((row: any) => string | number)
  /**
   * Default sort configuration (only applied when there is no persisted sort state)
   */
  defaultSortKey?: string
  defaultSortOrder?: 'asc' | 'desc'
  /**
   * Persist sort state (key + order) to localStorage using this key.
   * If provided, DataTable will load the stored sort state on mount.
   */
  sortStorageKey?: string
  /**
   * Enable server-side sorting mode. When true, clicking sort headers
   * will emit 'sort' events instead of performing client-side sorting.
   */
  serverSideSort?: boolean
  /** Emit 'rowClick' on row/card click and show pointer cursor (interactive cells should @click.stop) */
  clickableRows?: boolean
  /** Estimated row height in px for the virtualizer (default 56) */
  estimateRowHeight?: number
  /** Number of rows to render beyond the visible area (default 5) */
  overscan?: number
  /**
   * Only virtualize when the row count exceeds this threshold (default 100).
   * Smaller lists render in full, avoiding the scroll-compensation jank caused by
   * estimated-vs-actual row heights when rows have variable height.
   */
  virtualizeThreshold?: number
  /** Enable controlled row selection. Stable row keys are strongly recommended. */
  selectable?: boolean
  /** Selected row keys. Keys outside the current data page are preserved. */
  selectedKeys?: Array<string | number>
  /** Accessible label for a row selection checkbox. */
  selectionLabel?: string | ((row: any) => string)
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  stickyFirstColumn: true,
  stickyActionsColumn: true,
  expandableActions: true,
  defaultSortOrder: 'asc',
  serverSideSort: false,
  selectable: false,
  selectedKeys: () => []
})

const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const actionsExpanded = ref(false)

type PersistedSortState = {
  key: string
  order: 'asc' | 'desc'
}

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
})

const getSortableKeys = () => {
  const keys = new Set<string>()
  for (const col of props.columns) {
    if (col.sortable) keys.add(col.key)
  }
  return keys
}

const normalizeSortKey = (candidate: string) => {
  if (!candidate) return ''
  const sortableKeys = getSortableKeys()
  return sortableKeys.has(candidate) ? candidate : ''
}

const normalizeSortOrder = (candidate: any): 'asc' | 'desc' => {
  return candidate === 'desc' ? 'desc' : 'asc'
}

const readPersistedSortState = (): PersistedSortState | null => {
  if (!props.sortStorageKey) return null
  try {
    const raw = localStorage.getItem(props.sortStorageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PersistedSortState>
    const key = normalizeSortKey(typeof parsed.key === 'string' ? parsed.key : '')
    if (!key) return null
    return { key, order: normalizeSortOrder(parsed.order) }
  } catch (e) {
    console.error('[DataTable] Failed to read persisted sort state:', e)
    return null
  }
}

const writePersistedSortState = (state: PersistedSortState) => {
  if (!props.sortStorageKey) return
  try {
    localStorage.setItem(props.sortStorageKey, JSON.stringify(state))
  } catch (e) {
    console.error('[DataTable] Failed to persist sort state:', e)
  }
}

const resolveInitialSortState = (): PersistedSortState | null => {
  const persisted = readPersistedSortState()
  if (persisted) return persisted

  const key = normalizeSortKey(props.defaultSortKey || '')
  if (!key) return null
  return { key, order: normalizeSortOrder(props.defaultSortOrder) }
}

const applySortState = (state: PersistedSortState | null) => {
  if (!state) return
  sortKey.value = state.key
  sortOrder.value = state.order
}

const getSortIndicatorClass = (key: string, order: 'asc' | 'desc') => {
  return sortKey.value === key && sortOrder.value === order
    ? 'data-table-sort-indicator-active'
    : 'text-gray-300 transition-colors dark:text-dark-500'
}

const getColumnAriaSort = (key: string) => {
  if (sortKey.value !== key) return 'none'
  return sortOrder.value === 'asc' ? 'ascending' : 'descending'
}

const getHeaderContentAlignmentClass = (column: Column) => {
  const className = column.class || ''
  if (className.includes('text-center')) return 'justify-center'
  if (className.includes('text-right')) return 'justify-end'
  return 'justify-start'
}

const isNullishOrEmpty = (value: any) => value === null || value === undefined || value === ''

const toFiniteNumberOrNull = (value: any): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'boolean') return value ? 1 : 0
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const n = Number(trimmed)
    return Number.isFinite(n) ? n : null
  }
  return null
}

const toSortableString = (value: any): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value instanceof Date) return value.toISOString()
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const compareSortValues = (a: any, b: any): number => {
  const aEmpty = isNullishOrEmpty(a)
  const bEmpty = isNullishOrEmpty(b)
  if (aEmpty && bEmpty) return 0
  if (aEmpty) return 1
  if (bEmpty) return -1

  const aNum = toFiniteNumberOrNull(a)
  const bNum = toFiniteNumberOrNull(b)
  if (aNum !== null && bNum !== null) {
    if (aNum === bNum) return 0
    return aNum < bNum ? -1 : 1
  }

  const aStr = toSortableString(a)
  const bStr = toSortableString(b)
  const res = collator.compare(aStr, bStr)
  if (res === 0) return 0
  return res < 0 ? -1 : 1
}
const resolveStableRowKey = (row: any): string | number | undefined => {
  if (typeof props.rowKey === 'function') {
    const key = props.rowKey(row)
    return key ?? undefined
  }
  if (typeof props.rowKey === 'string' && props.rowKey) {
    const key = row?.[props.rowKey]
    return key ?? undefined
  }
  const key = row?.id
  return key ?? undefined
}

const resolveRowKey = (row: any, index: number) => resolveStableRowKey(row) ?? index

const dataColumns = computed(() => props.columns.filter((column) => column.key !== 'actions'))
const columnsSignature = computed(() =>
  props.columns.map((column) => `${column.key}:${column.sortable ? '1' : '0'}`).join('|')
)

const mobileFullWidthColumnKeys = new Set([
  'accounts',
  'api_key',
  'base_url',
  'description',
  'email',
  'endpoint',
  'error',
  'last_error',
  'message',
  'notes',
  'prompt',
  'remark',
  'token',
  'url',
])

const getMobileCellClass = (column: Column, index: number) => {
  const classes = ['mobile-table-field']

  if (index === 0) {
    classes.push('mobile-table-field-title')
  } else if (mobileFullWidthColumnKeys.has(column.key)) {
    classes.push('mobile-table-field-wide')
  }

  return classes
}

watch(
  isDesktopViewport,
  async (isDesktop) => {
    detachDesktopTableTracking()
    if (!isDesktop) return
    await nextTick()
    attachDesktopTableTracking()
  },
  { immediate: true, flush: 'post' }
)

// 数据/列变化时重新检查滚动状态
// 注意：不能监听 actionsExpanded，因为 checkActionsColumnWidth 会临时修改它，会导致无限循环
watch(
  [() => props.data.length, columnsSignature],
  async () => {
    await nextTick()
    checkScrollable()
    checkActionsColumnWidth()
  },
  { flush: 'post' }
)

// 单独监听展开状态变化，只更新滚动状态
watch(actionsExpanded, async () => {
  await nextTick()
  checkScrollable()
})

const handleSort = (key: string) => {
  let newOrder: 'asc' | 'desc' = 'asc'
  if (sortKey.value === key) {
    newOrder = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  if (props.serverSideSort) {
    // Server-side sort mode: emit event and update internal state for UI feedback
    sortKey.value = key
    sortOrder.value = newOrder
    emit('sort', key, newOrder)
  } else {
    // Client-side sort mode: just update internal state
    sortKey.value = key
    sortOrder.value = newOrder
  }
}

const sortedData = computed(() => {
  // Server-side sort mode: return data as-is (server handles sorting)
  if (props.serverSideSort || !sortKey.value || !props.data) return props.data

  const key = sortKey.value
  const order = sortOrder.value

  // Stable sort (tie-break with original index) to avoid jitter when values are equal.
  return props.data
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const cmp = compareSortValues(a.row?.[key], b.row?.[key])
      if (cmp !== 0) return order === 'asc' ? cmp : -cmp
      return a.index - b.index
    })
    .map(item => item.row)
})

const tableColumnCount = computed(() => props.columns.length + (props.selectable ? 1 : 0))
const selectedKeySet = computed(() => new Set(props.selectedKeys))
const visibleRowKeys = computed(() =>
  (sortedData.value ?? []).map((row, index) => resolveRowKey(row, index))
)
const allVisibleSelected = computed(() =>
  visibleRowKeys.value.length > 0
  && visibleRowKeys.value.every((key) => selectedKeySet.value.has(key))
)
const someVisibleSelected = computed(() => {
  if (allVisibleSelected.value) return false
  return visibleRowKeys.value.some((key) => selectedKeySet.value.has(key))
})

const emitSelection = (next: Set<string | number>) => {
  const keys = Array.from(next)
  emit('update:selectedKeys', keys)
  emit('selectionChange', keys)
}

const isRowSelected = (row: any, index: number) =>
  selectedKeySet.value.has(resolveRowKey(row, index))

const getRowSelectionLabel = (row: any, index: number) => {
  if (typeof props.selectionLabel === 'function') return props.selectionLabel(row)
  if (props.selectionLabel) return props.selectionLabel
  return `${t('common.selectOption')} ${resolveRowKey(row, index)}`
}

const toggleRowSelection = (row: any, index: number, checked: boolean) => {
  const next = new Set(props.selectedKeys)
  const key = resolveRowKey(row, index)
  if (checked) next.add(key)
  else next.delete(key)
  emitSelection(next)
}

const toggleAllVisible = (checked: boolean) => {
  const next = new Set(props.selectedKeys)
  for (const key of visibleRowKeys.value) {
    if (checked) next.add(key)
    else next.delete(key)
  }
  emitSelection(next)
}

// --- Virtual scrolling ---
// 是否启用虚拟化:仅桌面端且行数超过阈值时开启。小列表全量渲染,彻底绕开虚拟器的
// 估算/测量/滚动补偿链路,消除可变行高导致的滚动抖动。
const shouldVirtualize = computed(() =>
  isDesktopViewport.value && (sortedData.value?.length ?? 0) > (props.virtualizeThreshold ?? 100)
)

const rowVirtualizer = useVirtualizer(computed(() => ({
  count: shouldVirtualize.value ? (sortedData.value?.length ?? 0) : 0,
  getScrollElement: () => tableWrapperRef.value,
  // 用行主键(与模板 :key 一致)而非默认的 index 作为 itemSizeCache 键,
  // 这样排序/筛选/跨阈值来回都能复用正确的已测行高,而不是残留的按 index 缓存 → 消除高度校正抖动。
  getItemKey: (index: number) => {
    const row = sortedData.value?.[index]
    return row != null ? resolveRowKey(row, index) : index
  },
  estimateSize: () => props.estimateRowHeight ?? 56,
  overscan: props.overscan ?? 5,
  // 兜底高度:首个有效高度读数到来前,先按一屏渲染,避免空白帧
  initialRect: { width: 0, height: estimatedViewportHeight() },
  // 关键:过滤 0 高度读数,杜绝 scrollRect 被钉成 0 → calculateRange 返回 null → 整表空白
  observeElementRect: observeElementRectNonZero,
  // 把测量类 ResizeObserver 回调批到 rAF,避免滚动中同步 reflow 风暴导致的校正抖动/空白
  useAnimationFrameWithResizeObserver: true,
})))

const virtualItems = computed(() => rowVirtualizer.value.getVirtualItems())

const virtualPaddingTop = computed(() => {
  const items = virtualItems.value
  return items.length > 0 ? items[0].start : 0
})

const virtualPaddingBottom = computed(() => {
  const items = virtualItems.value
  if (items.length === 0) return 0
  return rowVirtualizer.value.getTotalSize() - items[items.length - 1].end
})

const measureElement = (el: any) => {
  if (el) {
    rowVirtualizer.value.measureElement(el as Element)
  }
}

type RowIdentityToken = string | number | object | symbol

const rowIdentityKeys = computed<RowIdentityToken[]>(() =>
  (sortedData.value ?? []).map((row) => {
    const stableKey = resolveStableRowKey(row)
    if (stableKey !== undefined) return stableKey

    // Object references survive pure reordering but change across page/filter results.
    // Primitive rows have no stable identity, so force conservative invalidation.
    return row !== null && typeof row === 'object' ? row : Symbol('unstable-row')
  })
)

const hasSameRowIdentitySet = (
  current: RowIdentityToken[],
  previous: RowIdentityToken[]
) => {
  if (current.length !== previous.length) return false
  const currentKeys = new Set(current)
  const previousKeys = new Set(previous)
  // Duplicate keys make row-to-cache ownership ambiguous, even when the unique
  // key set looks unchanged (for example [1, 1, 2] -> [1, 2, 2]).
  if (currentKeys.size !== current.length || previousKeys.size !== previous.length) return false
  return [...currentKeys].every(key => previousKeys.has(key))
}

watch(
  rowIdentityKeys,
  (current, previous) => {
    if (hasSameRowIdentitySet(current, previous)) return

    // The virtualizer owns caches across option updates. A new page/filter result
    // must release detached rows and sizes, while pure reordering keeps them.
    rowVirtualizer.value.measureElement(null)
    rowVirtualizer.value.measure()
  },
  { flush: 'post' }
)

// 统一的渲染行列表:虚拟化开启时只取窗口内的行(需 measure 交给虚拟器测量),
// 关闭时取全部行(无需测量)。模板据此渲染,两种模式共用同一套单元格结构。
const renderRows = computed<Array<{ index: number; row: any; measure: boolean }>>(() => {
  const data = sortedData.value ?? []
  if (shouldVirtualize.value) {
    return virtualItems.value.map(vr => ({ index: vr.index, row: data[vr.index], measure: true }))
  }
  return data.map((row, index) => ({ index, row, measure: false }))
})

const hasActionsColumn = computed(() => {
  return props.columns.some(column => column.key === 'actions')
})

const hasSelectColumn = computed(() => {
  return props.columns.length > 0 && props.columns[0].key === 'select'
})

// 生成固定列的 CSS 类
const getStickyColumnClass = (column: Column, index: number) => {
  const classes: string[] = []

  if (props.stickyFirstColumn) {
    // 如果第一列是勾选列，固定前两列（勾选+名称）
    if (hasSelectColumn.value) {
      if (index === 0) {
        classes.push('sticky-col sticky-col-left-first')
      } else if (index === 1) {
        classes.push('sticky-col sticky-col-left-second')
      }
    } else {
      // 否则只固定第一列
      if (index === 0) {
        classes.push('sticky-col sticky-col-left')
      }
    }
  }

  // 操作列固定（最后一列）
  if (props.stickyActionsColumn && column.key === 'actions') {
    classes.push('sticky-col sticky-col-right')
  }

  return classes.join(' ')
}

// 根据列数自适应调整内边距
const getAdaptivePaddingClass = () => {
  const columnCount = props.columns.length

  // 列数越多，内边距越小
  if (columnCount >= 10) {
    return 'px-2' // 8px
  } else if (columnCount >= 7) {
    return 'px-3' // 12px
  } else if (columnCount >= 5) {
    return 'px-4' // 16px
  } else {
    return 'px-6' // 24px (原始值)
  }
}

// Init + keep persisted sort state consistent with current columns
const didInitSort = ref(false)

onMounted(() => {
  const initial = resolveInitialSortState()
  applySortState(initial)
  didInitSort.value = true
})

watch(
  columnsSignature,
  () => {
    // If current sort key is no longer sortable/visible, fall back to default/persisted.
    const normalized = normalizeSortKey(sortKey.value)
    if (!sortKey.value) {
      const initial = resolveInitialSortState()
      applySortState(initial)
      return
    }

    if (!normalized) {
      const fallback = resolveInitialSortState()
      if (fallback) {
        applySortState(fallback)
      } else {
        sortKey.value = ''
        sortOrder.value = 'asc'
      }
    }
  },
  { flush: 'post' }
)

watch(
  [sortKey, sortOrder],
  ([nextKey, nextOrder]) => {
    if (!didInitSort.value) return
    if (!props.sortStorageKey) return
    const key = normalizeSortKey(nextKey)
    if (!key) return
    writePersistedSortState({ key, order: normalizeSortOrder(nextOrder) })
  },
  { flush: 'post' }
)

defineExpose({
  virtualizer: rowVirtualizer,
  shouldVirtualize,
  sortedData,
  resolveRowKey,
  tableWrapperEl: tableWrapperRef,
})
</script>

<style scoped>
.mobile-table-list {
  display: grid;
  gap: 0.75rem;
}

.mobile-table-card {
  padding: 0.68rem;
  overflow: hidden;
  border-color: rgba(94, 166, 226, 0.22);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.68)),
    rgba(255, 255, 255, 0.78);
  box-shadow:
    0 16px 36px rgba(56, 136, 203, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

:global(.dark) .mobile-table-card {
  border-color: rgba(124, 200, 255, 0.14);
  background:
    linear-gradient(145deg, rgba(31, 36, 58, 0.92), rgba(20, 27, 45, 0.82)),
    rgba(24, 31, 50, 0.86);
  box-shadow:
    0 16px 36px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.mobile-table-card-selected {
  border-color: var(--ui-primary, rgba(36, 152, 242, 0.54));
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.94), var(--ui-primary-soft, rgba(36, 152, 242, 0.12))),
    rgba(255, 255, 255, 0.82);
}

:global(.dark) .mobile-table-card-selected {
  border-color: var(--ui-primary, rgba(124, 200, 255, 0.42));
  background:
    linear-gradient(145deg, rgba(31, 36, 58, 0.95), var(--ui-primary-soft, rgba(124, 200, 255, 0.14))),
    rgba(24, 31, 50, 0.9);
}

.mobile-table-card-grid {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: flex-start;
  gap: 0.42rem;
}

.mobile-table-selection {
  flex: 1 0 100%;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.mobile-table-field {
  min-width: 0;
  max-width: 100%;
  flex: 0 1 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
  padding: 0.36rem 0.48rem;
  border: 1px solid rgba(148, 212, 255, 0.16);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.48);
}

:global(.dark) .mobile-table-field {
  border-color: rgba(124, 200, 255, 0.1);
  background: rgba(15, 23, 42, 0.3);
}

.mobile-table-field-title,
.mobile-table-field-wide,
.mobile-table-actions {
  flex: 1 0 100%;
  width: 100%;
}

.mobile-table-field-wide {
  flex-direction: column;
  align-items: stretch;
  gap: 0.24rem;
}

.mobile-table-field-title {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0 0 0.5rem;
  border: 0;
  border-bottom: 1px solid rgba(94, 166, 226, 0.18);
  border-radius: 0;
  background: transparent;
}

:global(.dark) .mobile-table-field-title {
  border-bottom-color: rgba(124, 200, 255, 0.12);
  background: transparent;
}

.mobile-table-label {
  flex: 0 0 auto;
  color: #64748b;
  font-size: 0.69rem;
  font-weight: 650;
  line-height: 1.35;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

:global(.dark) .mobile-table-label {
  color: #9ca3af;
}

.mobile-table-value {
  min-width: 0;
  color: var(--ui-ink, #1f2937);
  font-size: 0.84rem;
  line-height: 1.4;
  text-align: right;
  overflow-wrap: anywhere;
}

.mobile-table-field-wide .mobile-table-value {
  text-align: left;
}

.mobile-table-field-title .mobile-table-value {
  color: var(--ui-ink-strong, #111827);
  font-size: 0.95rem;
  font-weight: 700;
  text-align: right;
  max-width: 68%;
}

:global(.dark) .mobile-table-value {
  color: #f3f4f6;
}

.mobile-table-value :deep(.badge),
.mobile-table-value :deep([class*='rounded-full']) {
  max-width: 100%;
}

.mobile-table-actions {
  margin-top: 0.05rem;
  padding: 0.3rem;
  border: 1px solid rgba(148, 212, 255, 0.16);
  border-radius: 0.9rem;
  background: rgba(248, 250, 252, 0.66);
}

:global(.dark) .mobile-table-actions {
  border-color: rgba(124, 200, 255, 0.1);
  background: rgba(15, 23, 42, 0.32);
}

.mobile-table-actions :deep(> *) {
  width: 100%;
  display: flex !important;
  flex-wrap: nowrap;
  gap: 0.35rem;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.04rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.mobile-table-actions :deep(button),
.mobile-table-actions :deep(a) {
  width: auto !important;
  min-width: 0;
  max-width: 100%;
  min-height: 1.95rem;
  flex: 0 0 auto !important;
  flex-direction: row !important;
  gap: 0.28rem !important;
  justify-content: center;
  padding: 0.32rem 0.52rem !important;
  border-radius: 0.75rem;
  white-space: nowrap;
}

.mobile-table-actions :deep(button span),
.mobile-table-actions :deep(a span) {
  white-space: nowrap;
}

@media (max-width: 300px) {
  .mobile-table-card {
    padding: 0.75rem;
  }

  .mobile-table-card-grid {
    gap: 0.48rem;
  }

  .mobile-table-field {
    padding: 0.48rem 0.55rem;
  }

  .mobile-table-field-title {
    flex-direction: column;
    gap: 0.2rem;
  }

  .mobile-table-field-title .mobile-table-value {
    text-align: left;
  }
}
/* 表格横向滚动 */
.table-wrapper {
  --select-col-width: 52px; /* 勾选列宽度：px-6 (24px*2) + checkbox (16px) */
  position: relative;
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  isolation: isolate;
  color: var(--ui-ink, #25233a);
  background: var(--ui-surface-strong, rgba(255, 255, 255, 0.88));
}

:global(.dark) .table-wrapper {
  background: var(--ui-surface-strong, rgba(32, 30, 52, 0.9));
}

/* 表头容器，确保在滚动时覆盖表体内容 */
.table-wrapper .table-header {
  position: sticky;
  top: 0;
  z-index: 200;
  background: var(--ui-table-header, #e4f4ff);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

:global(.dark) .table-wrapper .table-header {
  background: var(--ui-table-header, #1d2237);
}

/* 表体保持在表头下方 */
.table-body {
  position: relative;
  z-index: 0;
  background: var(--ui-table-row, #ffffff);
}

:global(.dark) .table-body {
  background: var(--ui-table-row, #272d46);
}

.table-body td {
  border-bottom: 1px solid var(--ui-table-border, rgba(94, 166, 226, 0.18));
  background: var(--ui-table-row, #ffffff);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

:global(.dark) .table-body td {
  border-bottom-color: var(--ui-table-border, rgba(218, 223, 255, 0.08));
  background: var(--ui-table-row, #272d46);
}

/* 所有表头单元格固定在顶部 */
.sticky-header-cell {
  position: sticky;
  top: 0;
  z-index: 210; /* 必须高于所有表体内容 */
  background: var(--ui-table-header, #e4f4ff);
  border-bottom-color: var(--ui-table-border, rgba(94, 166, 226, 0.18));
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.data-table-sortable-header {
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    color 0.16s ease;
}

.data-table-sortable-header:hover,
.data-table-sort-active {
  color: var(--ui-primary-strong, #0c78d8);
  background: var(--ui-primary-soft, rgba(36, 152, 242, 0.13));
}

:global(.dark) .data-table-sortable-header:hover,
:global(.dark) .data-table-sort-active {
  color: var(--ui-primary-strong, #9ad7ff);
  background: var(--ui-primary-soft, rgba(124, 200, 255, 0.16));
}

.data-table-sort-indicator-active {
  color: var(--ui-primary-strong, #0c78d8);
}

:global(.dark) .sticky-header-cell {
  background: var(--ui-table-header, #1d2237);
  border-bottom-color: var(--ui-table-border, rgba(218, 223, 255, 0.08));
}

/* Sticky 列基础样式 */
.sticky-col {
  position: sticky;
  z-index: 20; /* 表体固定列 */
}

/* 单列固定（无勾选列时） */
.sticky-col-left {
  left: 0;
}

/* 双列固定（有勾选列时）：第一列（勾选） */
.sticky-col-left-first {
  left: 0;
}

/* 双列固定（有勾选列时）：第二列（名称） */
.sticky-col-left-second {
  left: var(--select-col-width);
}

/* 操作列固定 */
.sticky-col-right {
  right: 0;
}

/* 表头 sticky 列 - 需要比普通表头单元格更高的 z-index */
.sticky-header-cell.sticky-col {
  z-index: 220; /* 高于普通表头单元格和表体固定列 */
}

/* 表体 sticky 列背景 */
tbody .sticky-col {
  background: var(--ui-table-row, #ffffff);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

:global(.dark) .table-wrapper tbody .sticky-col {
  background: var(--ui-table-row, #272d46);
}

/* hover 状态保持 */
tbody tr:hover .sticky-col {
  background: var(--ui-table-hover, #eeecff);
}

:global(.dark) .table-wrapper tbody tr:hover .sticky-col {
  background: var(--ui-table-hover, #35304f);
}

.data-table-row {
  background: var(--ui-table-row, #ffffff);
  transition: background-color 0.15s ease;
}

.data-table-row:hover,
.data-table-row:hover > td {
  background: var(--ui-table-hover, #eeecff);
}

:global(.dark) .data-table-row {
  background: var(--ui-table-row, #272d46);
}

:global(.dark) .data-table-row:hover,
:global(.dark) .data-table-row:hover > td {
  background: var(--ui-table-hover, #35304f);
}

/* 阴影只在可滚动时显示 */
/* 单列固定右侧阴影 */
.is-scrollable .sticky-col-left::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 10px;
  transform: translateX(100%);
  background: linear-gradient(to right, var(--ui-primary-soft, rgba(36, 152, 242, 0.13)), transparent);
  pointer-events: none;
}

/* 双列固定：只在第二列显示阴影 */
.is-scrollable .sticky-col-left-second::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 10px;
  transform: translateX(100%);
  background: linear-gradient(to right, var(--ui-primary-soft, rgba(36, 152, 242, 0.13)), transparent);
  pointer-events: none;
}

/* 操作列左侧阴影 */
.is-scrollable .sticky-col-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 10px;
  transform: translateX(-100%);
  background: linear-gradient(to left, var(--ui-primary-soft, rgba(36, 152, 242, 0.13)), transparent);
  pointer-events: none;
}

/* 暗色模式阴影 */
:global(.dark) .is-scrollable .sticky-col-left::after,
:global(.dark) .is-scrollable .sticky-col-left-second::after {
  background: linear-gradient(to right, var(--ui-primary-soft, rgba(124, 200, 255, 0.16)), transparent);
}

:global(.dark) .is-scrollable .sticky-col-right::before {
  background: linear-gradient(to left, var(--ui-primary-soft, rgba(124, 200, 255, 0.16)), transparent);
}
</style>

<style>
/* ==========================================================================
   终极悬浮滚动条防丢器 (Sledgehammer Override)
   绕过 style.css 中 `* { scrollbar-color: transparent }` 的全局悬停隐身诅咒！
   ========================================================================== */

/* 1. 废除全局针对所有元素的 scrollbar-width 设定，拿回 Chrome/Safari 下 Webkit 滚动条规则的控制权！ */
.table-wrapper {
  scrollbar-width: auto !important; /* 阻止 Chrome 121 退化到原生 Mac 闪隐滚动条 */
}

/* 2. 重写 Webkit 滚动层，全部加上 !important 强制覆盖透明悬停陷阱 */
.table-wrapper::-webkit-scrollbar {
  height: 12px !important;
  width: 12px !important;
  display: block !important;
  background-color: transparent !important;
}

.table-wrapper::-webkit-scrollbar-track {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0.18)),
    var(--ui-scrollbar-track, rgba(231, 245, 255, 0.48)) !important;
  border-radius: 6px !important;
  margin: 0 4px !important;
}
.dark .table-wrapper::-webkit-scrollbar-track {
  background: var(--ui-scrollbar-track, rgba(124, 200, 255, 0.1)) !important;
}

/* 常驻、不透明的滑块，无视鼠标是否 hover 都在那！ */
.table-wrapper::-webkit-scrollbar-thumb {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.64), rgba(255, 255, 255, 0.12)),
    var(--ui-scrollbar-thumb, rgba(88, 183, 255, 0.46)) !important;
  border-radius: 6px !important;
  border: 2px solid transparent !important;
  background-clip: padding-box !important;
  -webkit-appearance: none !important;
}
.table-wrapper::-webkit-scrollbar-thumb:hover {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.44), rgba(255, 255, 255, 0.04)),
    var(--ui-scrollbar-thumb-hover, rgba(36, 152, 242, 0.72)) !important;
  background-clip: padding-box !important;
}

.dark .table-wrapper::-webkit-scrollbar-thumb {
  background: var(--ui-scrollbar-thumb, rgba(124, 200, 255, 0.4)) !important;
  background-clip: padding-box !important;
}
.dark .table-wrapper::-webkit-scrollbar-thumb:hover {
  background: var(--ui-scrollbar-thumb-hover, rgba(154, 215, 255, 0.68)) !important;
  background-clip: padding-box !important;
}

/* 3. 仅给真正的 Firefox 留的后路 */
@supports (-moz-appearance:none) {
  .table-wrapper {
    scrollbar-width: thin !important;
    scrollbar-color: var(--ui-scrollbar-thumb, rgba(88, 183, 255, 0.46)) transparent !important;
  }
  .dark .table-wrapper {
    scrollbar-color: var(--ui-scrollbar-thumb, rgba(124, 200, 255, 0.4)) transparent !important;
  }
}
</style>
