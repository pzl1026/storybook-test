<template>
  <div class="sc-input-number-body">
    <a-button
      style="padding: 4px 9px"
      @click="changeVal('reduce')"
    >
      <MinusOutlined />
    </a-button>
    <a-input-number
      style="margin: 0 10px"
      v-model:value="text"
      v-bind="$attrs"
    />
    <a-button
      style="padding: 4px 9px"
      @click="changeVal('add')"
    >
      <PlusOutlined />
    </a-button>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { ref, defineProps, watch, defineEmits, useAttrs } from 'vue'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'
const emit = defineEmits(['update:value', 'change'])
const props = defineProps({
  value: {
    type: Number,
    default: 0
  }
})
const attrs: any = useAttrs()
const text = ref(0)

watch(
  () => props.value,
  (val) => {
    text.value = val
  },
  { deep: true, immediate: true }
)

watch(
  () => text.value,
  (val) => {
    emit('update:value', val)
    emit('change', val)
  },
  { deep: true }
)

const changeVal = (type: any) => {
  if (type === 'add') {
    text.value += attrs.step || 1
    if (text.value > attrs.max) {
      text.value = attrs.max
    }
  } else {
    text.value -= attrs.step || 1
    if (text.value < attrs.min) {
      text.value = attrs.min
    }
  }
}
</script>

<style
  scoped
  lang="scss"
>
.sc-input-number-body {
  display: inline-block;
  .sc-number-change-btn {
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 1px solid #dcdcdc;
    transform: translateY(1px);

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
