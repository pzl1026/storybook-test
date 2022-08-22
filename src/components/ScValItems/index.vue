<template>
  <template
    v-for="item in enrtyItems"
    :key="item.name"
  >
    <div class="sc-form-item-content">
      <a-form-item
        v-bind="item.formItem"
        class="sc-form-item"
        v-if="item.show"
      >
        <template #label>
          <span
            v-if="itemRules[item.name]"
            style="color: #f00; font-weight: 800; line-height: 25px"
          >
            *&nbsp;
          </span>
          <slot
            :name="item.slot && item.slot.label"
            :key="item.name"
            :val="enrtyItemsValue[item.name]"
            :itemsVal="enrtyItemsValue"
          >
            {{ item.label }}
          </slot>
        </template>
        <template v-if="item.slot && item.slot.entry">
          <slot
            :name="item.slot.entry"
            :key="item.name"
            :val="enrtyItemsValue[item.name]"
            :itemsVal="enrtyItemsValue"
          ></slot>
        </template>
        <template v-else>
          <component
            :is="type(item)"
            style="width: 300px; margin-right: 10px"
            :options="item.entryBody && item.entryBody.options ? item.entryBody.options : []"
            @change="(e) => valueChange(e, item)"
            v-bind="item.entryBody"
            v-model:value="enrtyItemsValue[item.name]"
          >
          </component>
          <template v-if="item.entryBody && item.entryBody.asyncOptions && item.entryBody.asyncOptions.refresh">
            <span class="sc-options-refresh">
              <img
                src="./img/refresh.png"
                alt=""
              />
            </span>
          </template>
          <template v-if="item.slot && item.slot.entryRight">
            <slot :name="item.slot.entryRight"></slot>
          </template>
          <template v-else>
            <template v-if="item.entryBody && item.entryBody.tip">
              <span class="sc-input-tip">{{ item.entryBody.tip }}</span>
            </template>
          </template>
          <template v-if="item.slot && item.slot.entryBelow">
            <div class="sc-input-below">
              <span class="sc-below-tip-icon"> <InfoCircleOutlined style="color: #008cd3" />&nbsp; </span>
              <slot
                :name="item.slot.entryBelow"
                :key="item.name"
                :val="enrtyItemsValue[item.name]"
                :itemsVal="enrtyItemsValue"
              >
              </slot>
            </div>
          </template>
        </template>
      </a-form-item>
      <template v-if="item.slot && item.slot.below">
        <div>
          <slot
            :name="item.slot.below"
            :key="item.name"
            :val="enrtyItemsValue[item.name]"
            :itemsVal="enrtyItemsValue"
          ></slot>
        </div>
      </template>
      <a-row v-if="errorsMsg[item.name]">
        <a-col
          :offset="4"
          class="sc-item-error"
        >
          <slot
            :name="item.slot && item.slot.error"
            :key="item.name"
            :val="enrtyItemsValue[item.name]"
            :itemsVal="enrtyItemsValue"
          >
            <span> {{ errorsMsg[item.name].message }}</span>
          </slot>
        </a-col>
      </a-row>
    </div>
  </template>
</template>

<script
  setup
  lang="ts"
>
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { defineProps, defineExpose, defineEmits } from 'vue'
import { useItems, useValues, useOptions, useItemsProps } from './hooks'
import ScRadioButton from './components/ScRadioButton.vue'

const emit = defineEmits(['item:change', 'val:change', 'options:async'])

const typeComponentMap: any = {
  'sc-radio-button': ScRadioButton
}

const props: any = defineProps({
  itemsKey: {
    type: String,
    default: '1'
  },
  items: {
    type: Object,
    default() {
      return {}
    }
  },
  initialValue: {
    type: Object,
    default() {
      return {}
    }
  },
  setItemVal: {
    type: Function,
    default() {
      return {}
    }
  },
  rules: {
    type: [Object, Function],
    default(b: any) {
      return (a: any) => {
        return {}
      }
    }
  }
})

const { enrtyItems } = useItems(props)
const { collectAsyncOptionsRes } = useOptions(props, enrtyItems.value, emit, enrtyItems.value)
const { enrtyItemsValue, reset, valueChange, setValues, getValues, errorsMsg, itemRules } = useValues(
  props,
  enrtyItems.value,
  collectAsyncOptionsRes,
  emit
)
const { toggleVisble, changeItemsProps } = useItemsProps(props, enrtyItems, enrtyItemsValue)

const type = (item: any) => {
  return item.type && item.type.indexOf('sc') > -1 ? typeComponentMap[item.type] : `a-${item.type}`
}

defineExpose({
  reset,
  setValues,
  toggleVisble,
  changeItemsProps,
  values: enrtyItemsValue.value,
  getValues,
  errorsMsg
})
</script>

<style
  lang="scss"
  scoped
>
.sc-input {
  border-radius: 4px;
}

.ant-form-item ::v-deep {
  input,
  .ant-select-selector {
    border-radius: 3px;
  }

  .ant-form-item-label {
    text-align: left;
  }
}

.sc-form-item:last-child {
  margin-bottom: 0;
}
::v-deep .ant-form-item-label {
  & > label::after {
    content: '';
  }

  label {
    font-weight: 500;
  }
}
.sc-options-refresh {
  display: inline-block;
  cursor: pointer;
  img {
    width: 16px;
  }
}

.sc-input-tip {
  display: inline-block;
  margin-left: 5px;
  line-height: 32px;
  transform: translateY(2px);
  color: #999999;
}

.sc-input-below {
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: #999999;

  ::v-deep a {
    text-decoration: underline;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 0;
}

.sc-form-item-content {
  margin-bottom: 16px;
}

.sc-item-error {
  color: #f00;
  margin-top: 5px;
  height: 30px;
}
</style>
