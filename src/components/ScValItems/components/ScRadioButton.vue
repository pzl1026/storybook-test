<template>
  <a-radio-group v-model:value="radioValue">
    <a-radio-button
      v-for="item in options"
      :key="item?.value"
      :value="item?.value"
      :disabled="item.disabled"
    >
      {{ item?.label }}
    </a-radio-button>
  </a-radio-group>
</template>

<script
  setup
  lang="ts"
>
import { defineProps, defineEmits, watch, ref } from 'vue'
const emit = defineEmits(['update:value', 'change'])
const props = defineProps({
  value: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default() {
      return []
    }
  }
})

const radioValue: any = ref('')

watch(
  () => props.value,
  (val) => {
    radioValue.value = val
    emit('update:value', val)
  },
  { immediate: true }
)

watch(
  () => radioValue.value,
  (val) => {
    emit('update:value', val)
    emit('change', val)
  }
)
</script>

<style
  scoped
  lang="scss"
>
.ant-radio-group ::v-deep {
  .ant-radio-button-wrapper {
    background: #fafbfc;
    box-shadow: 0px 1px 3px 0px rgba(96, 108, 128, 0.1);
  }
  .ant-radio-button-wrapper {
    &:last-child {
      border-radius: 0 3px 3px 0;
    }
    &:first-child {
      border-radius: 3px 0 0 3px;
    }
  }
  .ant-radio-button-wrapper-checked {
    border-color: #d9d9d9;
    color: #008cd3;
    background-color: #fff;

    &:before {
      background-color: #d9d9d9;
    }
  }
}
</style>
