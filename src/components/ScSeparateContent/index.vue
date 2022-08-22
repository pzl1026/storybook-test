<template>
  <a-row
    type="flex"
    class="sc-page-content"
  >
    <a-col :span="24">
      <div
        class="sc-page-title"
        v-if="titleShow"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <slot></slot>
    </a-col>
  </a-row>
</template>

<script
  setup
  lang="ts"
>
import { defineProps, useSlots, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

const slots = useSlots()

const titleShow = computed(() => {
  return props.title || Reflect.ownKeys(slots).includes('title')
})
</script>

<style lang="scss">
.sc-page-content {
  display: flex;
  flex: 1;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0px 1px 3px 0px rgba(96, 108, 128, 0.05);

  .sc-page-title {
    font-size: 24px;
    font-weight: 500;
    line-height: 28px;
    margin-bottom: 20px;
  }
}
</style>
