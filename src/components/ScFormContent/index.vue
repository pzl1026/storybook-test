<template>
  <a-form
    :model="formValue"
    :rules="rules"
    ref="form"
    v-bind="$attrs"
  >
    <SeparateContent
      v-for="scheme in formScheme"
      :key="scheme?.key"
    >
      <ScValItems
        :itemsKey="scheme?.key"
        :items="scheme?.items"
        :rules="scheme?.rules"
        @item:change="changeItemData"
        :setItemVal="setFormData"
        :ref="(e) => setItemRef(e, scheme?.key)"
        :initialValue="initialValue[scheme?.key]"
        @options:async="(...args) => emit('options:async', ...args)"
      >
        <template
          v-for="slo in slosNoType"
          :key="slo"
          v-slot:[slo]="{ key, val, itemsVal }"
        >
          <slot
            :itemsKey="scheme?.key"
            :name="slo"
            :key="key"
            :val="val"
            :itemsVal="itemsVal"
          >
          </slot>
        </template>

        <!-- 代码保留之前的做法 -->
        <!-- <template v-for="slo in slos[scheme?.key].below" :key="slo" v-slot:[slo]="{scheme}">
        <slot :schemeKey="scheme?.key" :name="slo">
        </slot>
      </template> -->
      </ScValItems>
    </SeparateContent>
  </a-form>
</template>

<script
  setup
  lang="ts"
>
import { defineProps, defineEmits, defineExpose } from 'vue'
import ScValItems from '../ScValItems/index.vue'
import SeparateContent from '../separateContent/index.vue'
import { useFormSlots, useFormData, useItemsRefs } from './hooks'
const emit = defineEmits(['change', 'item:change', 'options:async'])

const props = defineProps({
  formValue: {
    type: Object,
    default() {
      return {}
    }
  },
  rules: {
    type: Object,
    default() {
      return {}
    }
  },
  formScheme: {
    type: Array,
    default() {
      return {}
    }
  },
  initialValue: {
    type: Object,
    default() {
      return {}
    }
  }
})
const { setItemRef, valItemsRefs, toggleVisble, changeItemsProps } = useItemsRefs(props)
const { slosNoType } = useFormSlots(props)
const { formData, changeItemData, setFormData, reset, getValues } = useFormData(props, valItemsRefs, emit)

defineExpose({
  setFormData,
  reset,
  formData,
  toggleVisble,
  changeItemsProps,
  getValues
})
</script>
