<template>
  <div class="sc-ip-content">
    <template
      v-for="(ip, index) in ips"
      :key="index"
    >
      <div class="sc-ip-input">
        <a-input-number
          class="sc-ip-input-number"
          :min="min"
          :max="max"
          v-model:value="ips[index]"
          :disabled="disabled[index]"
        />
      </div>
      <div
        class="sc-ip-input-dot"
        v-if="index < ips.length - 1"
      ></div>
    </template>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { ref, defineEmits, defineProps, watch } from 'vue'
const emit = defineEmits(['update:value', 'change'])
const props = defineProps({
  value: {
    type: Array,
    default() {
      return [0, 0, 0, 0]
    }
  },
  disabled: {
    type: Array,
    default() {
      return [false, false, false, false]
    }
  }
})
const min = 0
const max = 255

const ips: any = ref([0, 0, 0, 0])

watch(
  () => props.value,
  (val) => {
    ips.value = val
  },
  { deep: true, immediate: true }
)

watch(
  () => ips.value,
  (val) => {
    emit('update:value', val)
    emit('change', val)
  },
  { deep: true }
)
</script>

<style
  scoped
  lang="scss"
>
.sc-ip-content {
  .sc-ip-input {
    display: inline-block;

    .sc-ip-input-number {
      width: 70px;
      height: 32px;
    }
  }
  .sc-ip-input-dot {
    display: inline-block;
    width: 20px;
    height: 20px;
    text-align: center;

    &:before {
      content: '';
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #d9d9d9;
      transform: translateY(-3px);
    }
  }
}
</style>
