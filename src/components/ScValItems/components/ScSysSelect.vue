<template>
  <div class="sc-server">
    <div class="sc-server-content">
      <div
        v-for="server in servers"
        :key="server.name"
        @click="changeSys(server.name, server)"
        :class="['sc-server-item', sysSelected(server.name) ? 'sc-server-item-selected' : '']"
      >
        <div class="sc-server-body">
          <div class="sc-server-img">
            <img
              :src="require(`./assets/${server.name}.png`)"
              alt=""
            />
          </div>
          <div class="sc-server-name">{{ firstUpper(server.name) }}</div>
        </div>
        <div class="sc-server-bit-select">
          <div
            class="sc-server-bit-input"
            @click="() => optionsShow(server.name)"
          >
            <span
              class="sc-server-bit-placeholder"
              :sytle="{ color: selectedLabel.sys == server.name && selectedLabel.bitText ? '#666' : '' }"
            >
              {{ selectedLabel.sys == server.name && selectedLabel.bitText ? selectedLabel.bitText : '请选择镜像' }}
            </span>
            <span class="sc-server-bit-value"></span>
            <span class="sc-server-bit-arrow">
              <DownOutlined style="font-size: 12px" />
            </span>
          </div>
          <Transition>
            <ul
              class="sc-server-bit-options"
              v-if="showServer[server.name]"
            >
              <li
                v-for="opt in server.bitOptions"
                :key="opt.value"
                @click="(e) => changeBit(e, opt, server.name)"
                :class="[bitSelected(server.name, opt.value) ? 'sc-server-bit-active' : '']"
              >
                <span> {{ opt.label }}</span>
              </li>
            </ul>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, defineEmits, defineProps, watch } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'

const emit = defineEmits(['change'])

const props = defineProps({
  options: {
    type: Array,
    default() {
      return []
    }
  }
})

const serverArr = [
  {
    name: 'centos',
    bitOptions: [
      {
        label: '61.4 32位',
        value: 1
      },
      {
        label: '64.4 32位',
        value: 2
      }
    ]
  },
  {
    name: 'ubuntu',
    bitOptions: [
      {
        label: '61.4 32位',
        value: 1
      },
      {
        label: '64.4 32位',
        value: 2
      }
    ]
  },
  {
    name: 'windows',
    bitOptions: [
      {
        label: '61.4 32位',
        value: 1
      },
      {
        label: '64.4 32位',
        value: 2
      }
    ]
  }
]

const showServer = ref({})
const servers = ref(serverArr)
const val = ref({
  sys: '',
  bit: '',
  imageId: '',
  imageName: ''
})

watch(
  () => props.options,
  (val) => {
    servers.value = val
  },
  { deep: true, immediate: true }
)

const selectedLabel = computed(() => {
  const selected = {
    sys: '',
    bitText: ''
  }
  const v = val.value
  const currentSys = servers.value.find((m) => m.name === v.sys)
  if (currentSys) {
    selected.sys = currentSys.name
    const currBit = currentSys.bitOptions.find((m) => m.value === v.bit)
    if (currBit) {
      selected.bitText = currBit.label
    }
  }
  return selected
})

const firstUpper = (str) => {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
}

const optionsShow = (name) => {
  if (!showServer.value[name]) {
    showServer.value[name] = true
  } else {
    showServer.value[name] = false
  }
  for (const k in showServer.value) {
    if (k !== name) {
      showServer.value[k] = false
    }
  }
}

const hideOptions = (e) => {
  if (!e.target.closest('.sc-server-bit-select')) {
    for (const name in showServer.value) {
      showServer.value[name] = false
    }
  }
}

const changeSys = (sys, server) => {
  if (val.value.sys !== sys) {
    val.value.sys = sys
    val.value.bit = ''
  }
  val.value.imageId = server.id
  emit('change', val.value)
}

const changeBit = (e, opt, serverName) => {
  e.stopPropagation()
  val.value.bit = opt.value
  val.value.imageName = `${val.value.imageId} ${opt.value}`
  showServer.value[serverName] = false
  emit('change', val.value)
}

onMounted(() => {
  document.addEventListener('click', hideOptions)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', hideOptions)
})

const sysSelected = (sys) => {
  return sys === val.value.sys
}

const bitSelected = (sys, bit) => {
  return sysSelected(sys) && bit === val.value.bit
}
</script>

<style
  lang="scss"
  scoped
>
.sc-server {
  display: inline-block;

  .sc-server-body {
    transition: all 0.3s ease;
    border-bottom: 1px solid #eee;
  }

  .sc-server-content {
    display: flex;
    transition: all 0.3s ease;
    .sc-server-item-selected {
      border: 1px solid #008cd3;

      & .sc-server-body {
        border-bottom: 1px solid #008cd3;
      }
    }
  }
}
.sc-server-item {
  width: 180px;
  box-shadow: 0px 1px 3px 0px rgba(96, 108, 128, 0.05);
  border: 1px solid #eee;
  margin-right: 40px;
  border-radius: 6px;
  background: #f3f5f8;
  cursor: pointer;
  transition: all 0.3s ease;

  .sc-server-body {
    display: flex;
    width: 100%;
    height: 120px;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;

    .sc-server-img {
      display: flex;
      width: 80px;
      height: 80px;
      align-items: center;
      justify-content: center;
      // overflow: hidden;

      img {
        width: 120px;
        object-fit: contain;
      }
    }

    .sc-server-name {
      color: #008cd3;
      font-size: 16px;
      font-family: Montserrat-SemiBold, Montserrat;
      font-weight: 600;
      transform: translateY(-20px);
    }
  }

  .sc-server-bit-select {
    height: 35px;
    cursor: pointer;
    position: relative;
    z-index: 1;

    .sc-server-bit-options {
      position: absolute;
      top: calc(100% + 10px);
      left: 0;
      width: 100%;
      padding: 0;
      background: #fff;
      border-radius: 6px;
      padding: 6px;
      box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 0px rgba(0, 0, 0, 0.05),
        0px 12px 48px 0px rgba(0, 0, 0, 0.03);
      transform-origin: 50% 0;

      li {
        list-style: none;
        height: 32px;
        cursor: pointer;
        border-radius: 3px;
        padding: 6px;
        font-weight: 500;
        transition: all 0.3s ease;
        margin-bottom: 5px;

        &.sc-server-bit-active,
        &:hover {
          background: #ecf2fe;
          color: #008cd3;
        }
      }
    }

    .sc-server-bit-input {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
      height: 100%;
      padding: 0 10px;
      background: linear-gradient(180deg, #f3f5f8 0%, #fffeff 100%);
      border-radius: 6px;

      &:hover {
        background: linear-gradient(180deg, #f3f5f8 0%, #fffeff 100%);
      }

      span {
        display: inline-block;
      }

      .sc-server-bit-placeholder {
        color: #666;
      }

      .sc-server-bit-value {
      }

      .sc-server-bit-arrow {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        height: 100%;
        width: 35px;
        right: 0;
        top: 0;
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  transform: rotateX(90deg);
}
</style>
