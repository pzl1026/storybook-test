<template>
  <ScFormContent
    :formScheme="formItemsAll"
    key="111"
    ref="f"
  >
    <template #item5-entry="{ val, itemsVal }">
      <span> 这里是自定义输入框</span>
      <span>当前值：val: {{ val }}</span>
      <div>所有值：{{ itemsVal }}</div>
      <a-input
        style="width: 100px"
        v-model:value="val.v1"
      ></a-input>
      <a-input
        style="width: 100px"
        v-model:value="val.v2"
      ></a-input>
    </template>
    <template #item6-entry-right>这里是右侧提示</template>
    <template #item6-entry-below>这里是右侧下方提示</template>
    <template #item6-below>这里是当前输入框item6正下方，适用场景：如下方是一个item6下有个table</template>
    <template #item6-label>item6 label</template>
  </ScFormContent>
  <a-button @click="getFormData">获取form的所有数据</a-button>
  <a-button @click="submit">提交</a-button>
</template>

<script setup>
import { ref } from 'vue'
import ScFormContent from '../../../components/ScFormContent/index.vue'
import { formItemsAll } from './config'
const f = ref()
const getFormData = () => {
  console.log(1)
}

const submit = () => {
  f.value.getValues(true, true, ['items1']).then((data) => {
    console.log(data, 'data222')
  })
}
</script>
