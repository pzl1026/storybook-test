<template>
  <a-modal
    v-model:visible="visible"
    v-bind="$attrs"
    wrapClassName="sc-modal"
    :footer="false"
    @cencel="cancel"
  >
    <template v-if="needTip">
      <div class="sc-modal-tip">
        <slot name="tip-icon"></slot>
        <slot name="tip-text"></slot>
      </div>
    </template>
    <div class="sc-modal-content">
      <slot></slot>
      <div class="sc-modal-btn">
        <a-button
          class="sc-modal-cancel"
          @click="cancel"
          >取消</a-button
        >
        <a-button
          class="sc-modal-sure"
          @click="ok"
          >确认</a-button
        >
      </div>
    </div>
  </a-modal>
</template>

<script
  setup
  lang="ts"
>
import { defineProps, defineEmits, computed } from 'vue'

const emit = defineEmits(['update:show', 'ok', 'cancel'])
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  needTip: {
    type: Boolean,
    default: false
  }
})

const visible = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

const cancel = () => {
  emit('cancel')
}

const ok = () => {
  emit('ok')
}
</script>

<style lang="scss">
.sc-modal {
  .sc-modal-btn {
    display: flex;
    justify-content: center;
    margin-top: 16px;

    .ant-btn {
      line-height: 24px;
      height: 32px;
      border: 0;
      border-radius: 3px;
    }

    .sc-modal-cancel {
      border-radius: 3px;
      background: #e7e7e7;
      margin-right: 16px;

      &:hover {
        background: #eee;
        color: #000;
      }
    }

    .sc-modal-sure {
      background: #008cd3;
      color: #fff;

      &:hover {
        background: #40a9ff;
      }
    }
  }
  .sc-modal-content {
    padding: 32px 20px;
  }
  .ant-modal-content {
    border-radius: 9px;
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-close {
    color: #fff;
  }
  .ant-modal-header {
    background: #008cd3 !important;
    border-radius: 9px 9px 0 0;

    .ant-modal-title {
      color: #fff;
      font-size: 16px;
    }
  }

  .sc-modal-tip {
    background: rgba(249, 224, 199, 0.3);
    padding: 8px 16px;
    width: 100%;
    color: #ed7b2f;
    font-size: 12px;
  }
}
</style>
