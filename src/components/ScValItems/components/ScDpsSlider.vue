<template>
  <div style="width: 680px">
    <vue-slider
      v-model="sliderVal"
      :tooltip="'none'"
      :interval="10"
      :railStyle="railStyle"
      :processStyle="processStyle"
    >
      <template v-slot:dot="{ value, focus }">
        <div class="custom-dot-wrapper">
          <div :class="['custom-dot', { focus }]">{{ value }} Mbps</div>
        </div>
      </template>
    </vue-slider>
    <div class="sc-dps-max-val">
      <span>0Mps</span>
      <span>200Mps</span>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { defineProps, defineEmits, computed } from 'vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

const emit = defineEmits(['update:value', 'change'])
const props = defineProps({
  value: {
    type: [Number, String],
    default: 0
  }
})
const processStyle = {
  background: '##008CD3'
}
const railStyle = {
  height: '10px'
}

const sliderVal = computed({
  get: () => props.value,
  set: (val: any) => {
    emit('update:value', val)
    emit('change', val)
  }
})
</script>

<style>
.custom-dot-wrapper {
  height: 22px;
  padding: 0 5px;
  background: #fff;
  width: 80px;
  transform: translate(-50%, -4px);
  border-radius: 11px;
  transition: all 0.3s;
  cursor: pointer;
}
.custom-dot {
  /* width: 100%;
  height: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 22px;
  width: 70px;
  background-color: #23a6f3;
  box-shadow: 0px 2px 5px 0px rgba(35, 166, 243, 0.5);
  color: #fff;
  font-weight: 600;
  border-radius: 11px;
}

.sc-dps-max-val {
  display: flex;
  justify-content: space-between;
  color: #bfbfbf;
  font-size: 12px;
}
</style>
