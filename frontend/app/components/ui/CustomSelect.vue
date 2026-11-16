<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDown, Check, Search } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';

export interface SelectOption {
  label: string;
  value: string | number;
  description?: string;
  badge?: string;
  icon?: any;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number;
    options: Array<string | number | SelectOption>;
    placeholder?: string;
    disabled?: boolean;
    searchable?: boolean;
    theme?: 'indigo' | 'emerald' | 'rose' | 'default';
  }>(),
  {
    modelValue: '',
    placeholder: 'Select an option',
    disabled: false,
    searchable: false,
    theme: 'rose',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number): void;
  (e: 'change', val: string | number): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const searchQuery = ref('');

onClickOutside(containerRef, () => {
  isOpen.value = false;
});

const normalizedOptions = computed<SelectOption[]>(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return opt as SelectOption;
    }
    return {
      label: String(opt),
      value: opt,
    };
  });
});

const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) return normalizedOptions.value;
  const q = searchQuery.value.toLowerCase();
  return normalizedOptions.value.filter(
    (o) =>
      o.label.toLowerCase().includes(q) ||
      (o.description && o.description.toLowerCase().includes(q))
  );
});

const selectedOption = computed(() => {
  return normalizedOptions.value.find((o) => o.value === props.modelValue);
});

const displayText = computed(() => {
  if (selectedOption.value) return selectedOption.value.label;
  return props.placeholder;
});

const isPlaceholder = computed(() => !selectedOption.value);

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = '';
  }
};

const selectOption = (opt: SelectOption) => {
  emit('update:modelValue', opt.value);
  emit('change', opt.value);
  isOpen.value = false;
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (props.disabled) return;
  if (e.key === 'Escape') {
    isOpen.value = false;
  } else if (e.key === 'Enter' || e.key === ' ') {
    if (!isOpen.value) {
      e.preventDefault();
      isOpen.value = true;
    }
  }
};

const themeClasses = computed(() => {
  switch (props.theme) {
    case 'indigo':
      return {
        focusRing: 'focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
        activeOption: 'bg-indigo-500/20 text-indigo-400 font-semibold',
        hoverOption: 'hover:bg-indigo-500/10 hover:text-indigo-300',
        checkColor: 'text-indigo-400',
      };
    case 'emerald':
      return {
        focusRing: 'focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500',
        activeOption: 'bg-emerald-500/20 text-emerald-400 font-semibold',
        hoverOption: 'hover:bg-emerald-500/10 hover:text-emerald-300',
        checkColor: 'text-emerald-400',
      };
    case 'rose':
      return {
        focusRing: 'focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500',
        activeOption: 'bg-rose-500/20 text-rose-400 font-semibold',
        hoverOption: 'hover:bg-rose-500/10 hover:text-rose-300',
        checkColor: 'text-rose-400',
      };
    default:
      return {
        focusRing: 'focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500',
        activeOption: 'bg-rose-500/20 text-rose-400 font-semibold',
        hoverOption: 'hover:bg-rose-500/10 hover:text-rose-300',
        checkColor: 'text-rose-400',
      };
  }
});
</script>

<template>
  <div ref="containerRef" class="relative select-none text-left" @keydown="handleKeyDown">
    <!-- Trigger Button -->
    <button
      type="button"
      :disabled="disabled"
      class="group relative flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200/90 dark:border-rose-950/60 bg-white dark:bg-[#120A1D] px-3.5 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition-all duration-150 outline-none"
      :class="[
        themeClasses.focusRing,
        disabled
          ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900'
          : 'hover:border-rose-400 dark:hover:border-rose-800/80 cursor-pointer',
        isOpen ? 'ring-2 border-rose-500 dark:border-rose-500' : '',
      ]"
      @click="toggleDropdown"
    >
      <div class="flex items-center gap-2 truncate">
        <component
          :is="selectedOption.icon"
          v-if="selectedOption?.icon"
          class="h-4 w-4 shrink-0 text-slate-400"
        />
        <span
          class="truncate"
          :class="isPlaceholder ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100 font-medium'"
        >
          {{ displayText }}
        </span>
      </div>

      <ChevronDown
        class="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu Popover -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-1"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 z-50 mt-1.5 min-w-[200px] origin-top rounded-xl border border-slate-200 dark:border-rose-950/80 bg-white/95 dark:bg-[#120A1D]/95 p-1.5 shadow-2xl backdrop-blur-xl max-h-64 overflow-y-auto custom-scrollbar"
      >
        <!-- Search bar if > 6 options or searchable -->
        <div
          v-if="searchable || normalizedOptions.length > 7"
          class="sticky top-0 z-10 mb-1 px-1 pt-1 pb-1.5 bg-inherit border-b border-slate-100 dark:border-rose-950/60"
        >
          <div class="relative flex items-center">
            <Search class="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Filter options..."
              class="w-full rounded-lg border border-slate-200 dark:border-rose-950/80 bg-slate-50 dark:bg-[#0B0612] pl-8 pr-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
              @click.stop
            />
          </div>
        </div>

        <!-- Options List -->
        <div class="space-y-0.5">
          <button
            v-for="opt in filteredOptions"
            :key="String(opt.value)"
            type="button"
            class="group/opt flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs sm:text-sm text-left transition-colors duration-100 cursor-pointer"
            :class="[
              opt.value === modelValue
                ? themeClasses.activeOption
                : 'text-slate-700 dark:text-slate-300 ' + themeClasses.hoverOption,
            ]"
            @click.stop="selectOption(opt)"
          >
            <div class="flex items-center gap-2 truncate">
              <component
                :is="opt.icon"
                v-if="opt.icon"
                class="h-4 w-4 shrink-0 text-slate-400 group-hover/opt:text-slate-200"
              />
              <div>
                <span class="block truncate">{{ opt.label }}</span>
                <span
                  v-if="opt.description"
                  class="block text-[11px] text-slate-400 dark:text-slate-500 font-normal truncate"
                >
                  {{ opt.description }}
                </span>
              </div>
            </div>

            <Check
              v-if="opt.value === modelValue"
              class="h-4 w-4 shrink-0"
              :class="themeClasses.checkColor"
            />
          </button>

          <div
            v-if="filteredOptions.length === 0"
            class="px-3 py-3 text-center text-xs text-slate-400"
          >
            No matching options
          </div>
        </div>
      </div>
    </Transition>

    <!-- Hidden native select for form compatibility / accessibility -->
    <select
      :value="modelValue"
      :disabled="disabled"
      tabindex="-1"
      aria-hidden="true"
      class="sr-only pointer-events-none"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="opt in normalizedOptions"
        :key="String(opt.value)"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
