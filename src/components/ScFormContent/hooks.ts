/**
 * formContent相关hooks逻辑，所有逻辑基于valItems组件，
 * 不同于ant form，ant from耦合优点高，不方便解偶
 * 通过数组传递valItems的所有props，遵循页面布局
 */

import { ref, watch, nextTick } from 'vue'
import { propsType } from './types'
import { cloneDeep } from '../utils'

/**
 * 所有valItems的ref和一些方法
 * @param props
 * @returns
 */
export function useItemsRefs(props: propsType) {
  const valItemsRefs: any = {}

  const setItemRef = (el: any, itemsKey: any) => {
    if (el) {
      valItemsRefs[itemsKey] = el
    }
  }

  /**
   * 手动显示隐藏
   * @param show 是否显示
   * @param itemsKey 哪个items
   * @param hideFields 涉及字段
   */
  function toggleVisble(show: boolean, itemsKey: string, hideFields: Array<any>) {
    valItemsRefs[itemsKey].toggleVisble(show, hideFields)
  }

  /**
   * 手动修改items里面的props属性，如options
   * @param callback
   * @param name
   * @param itemsKey
   */
  function changeItemsProps(callback: any, name: string, itemsKey?: string) {
    let itemsK: any = itemsKey

    if (!itemsKey) {
      const keys = Reflect.ownKeys(valItemsRefs)
      if (keys.length > 0) {
        itemsK = keys[0]
      }
    }
    valItemsRefs[itemsK].changeItemsProps(callback, name)
  }

  // 待定:注册自定义的组件
  function registerComponent(component: any) {
    console
  }

  return {
    setItemRef,
    valItemsRefs,
    toggleVisble,
    changeItemsProps,
    registerComponent
  }
}

/**
 * form相关数据
 * @param props
 * @param valItemsRefs
 * @param emit
 * @returns
 */
export function useFormData(props: propsType, valItemsRefs: any, emit: any) {
  const { formScheme } = props
  const formData: any = ref({})
  const initialVal: any = ref({})
  let firstFlag = true

  /**
   * 获取初始化的值
   */
  function getDefaultValue() {
    const defaultValue: any = {}

    formScheme.forEach((m: any) => {
      m.items.forEach((n: any) => {
        defaultValue[n.name] = n.defaultValue
        // 初始化值缓存
        initialVal.value[n.name] = cloneDeep(n.defaultValue)
      })
    })
    formData.value = defaultValue
  }
  getDefaultValue()

  // 当获取异步初始值时，进行相关修改初始化值
  watch(
    () => props.initialValue,
    (val: any) => {
      nextTick(() => {
        if (firstFlag && Reflect.ownKeys(val).length !== 0) {
          for (const itemsKey in val) {
            if (Reflect.ownKeys(val[itemsKey]).length > 0) {
              for (const k in val[itemsKey]) {
                // if (val[itemsKey][k]._isAMomentObject) {
                //   throw new Error('initialValue不用传入moment对象')
                // }
                formData.value[k] = cloneDeep(val[itemsKey][k])
                // 初始化值缓存
                initialVal.value[k] = cloneDeep(val[itemsKey][k])
              }
            }
          }
          /**
           *  待定：对initialValue传入的时Object进行相关处理
           */
          firstFlag = false
        }
      })
    },
    { immediate: true }
  )

  /**
   * 当值修改时触发
   * @param value
   * @param key
   * @param enrtyItemsValue 所有items里面的值
   * @param itemsKey 当前的items
   * @param item
   */
  function changeItemData(value: any, key: string, enrtyItemsValue: any, itemsKey: string, item: any) {
    emit('item:change', value, key, enrtyItemsValue, itemsKey, item)
    formData.value = {
      ...formData.value,
      ...enrtyItemsValue
    }
    // emit('change', formData.value)
  }

  /**
   * 手动设置values
   * @param val
   * @param itemsKey
   * @param key
   */
  function setFormData(val: any, itemsKey: any, key: any) {
    formData.value[key] = val
    valItemsRefs[itemsKey].setValues(val, key)
    emit('change', formData.value)
  }

  // 重置
  function reset() {
    for (const i in formData.value) {
      if (!Reflect.has(initialVal.value, i)) {
        formData.value[i] = undefined
      } else {
        formData.value[i] = cloneDeep(initialVal.value[i])
      }
    }

    formScheme.forEach((items: any) => {
      valItemsRefs[items.key].reset()
    })
  }

  /**
   * 获取所有的值
   * @param isValidate
   * @param filterNoUse
   * @param itemsKeys
   * @returns
   */
  function getValues(isValidate = false, filterNoUse = false, itemsKeys?: any) {
    return new Promise((resolve, reject) => {
      const valuesPromises = []

      // 不传itemsKeys那么就获取所有的值
      if (!itemsKeys || itemsKeys.length === 0) {
        for (const k in valItemsRefs) {
          valuesPromises.push(valItemsRefs[k].getValues(isValidate, filterNoUse))
        }
      } else {
        for (const k in valItemsRefs) {
          if (itemsKeys.includes(k)) {
            valuesPromises.push(valItemsRefs[k].getValues(isValidate, filterNoUse))
          }
        }
      }

      Promise.all(valuesPromises).then((data: any) => {
        resolve(formData.value)
      }, reject)
    })
  }

  return {
    formData,
    changeItemData,
    setFormData,
    reset,
    initialVal,
    getValues
  }
}

/**
 * 处理所有的slot
 * @param props
 * @returns
 */
export function useFormSlots(props: propsType) {
  const { formScheme } = props
  const slos = ref({})
  const slosNoType: any = ref([])

  // 获取所有的items相关的slot
  function getItemsSlots() {
    const sls: any = {}
    formScheme.forEach((scheme: any) => {
      sls[scheme.key] = {
        entry: [],
        below: [],
        entryRight: [],
        entryBelow: []
      }
      scheme.items.forEach((item: any) => {
        if (item.slot) {
          ;['entry', 'below', 'entryRight', 'entryBelow'].forEach((name: any) => {
            if (item.slot[name]) {
              sls[scheme.key][name].push(item.slot[name])
              slosNoType.value.push(item.slot[name])
            }
          })
        }
      })
    })
    slos.value = sls
  }

  getItemsSlots()

  return {
    slos,
    slosNoType
  }
}
