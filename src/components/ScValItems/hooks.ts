/**
 * 将form-item与a-form解偶，方便页面结构发生变化时的逻辑服用
 */
import { ref, reactive, watch } from 'vue'
import { propsType } from './types'
import Schema from 'async-validator'
import { cloneDeep, isType, dataByField, trimNoUseFeilds } from '../utils'

// 固定属性，即使没穿，也存在
const fixProps = [
  {
    propsName: 'formItem',
    type: 'Object'
  }
]

/**
 * 用于对数组元素进行处理
 * @param handleArgs
 * @param items
 */
function transformItems(handleArgs: Array<any>, items: any) {
  handleArgs.forEach((handle: any) => {
    handle(items)
  })
}

// 添加item的固定属性
function addFixProps(items: any) {
  items.forEach((vItem: any) => {
    fixProps.forEach((fpItem: any) => {
      if (!vItem[fpItem.propsName]) {
        switch (fpItem.type) {
          case 'Object':
            vItem[fpItem.propsName] = {}
            break
          case 'Array':
            vItem[fpItem.propsName] = []
            break
          case 'Number':
            vItem[fpItem.propsName] = 0
            break
          default:
            vItem[fpItem.propsName] = ''
            break
        }
      }
    })
  })
}

/**
 * 处理每个item的布局
 * @param items
 */
function handleItemsLayout(items: any) {
  items.forEach((vItem: any) => {
    const formItem = vItem.formItem
    formItem.wrapperCol = formItem.wrapperCol || { span: 20 }
    formItem.labelCol = formItem.labelCol || { span: 4 }
  })
}

/**
 * 初始化每个item的显示/隐藏
 * @param items
 */
function handleItemsShow(items: any) {
  items.forEach((vItem: any) => {
    if (vItem.show === undefined) {
      vItem.show = true
    }
  })
}

// 处理异步options
function handleAsyncOptions(items: any, emit: any, collectAsyncOptionsRes: any, otherParams?: any, relate?: any) {
  const fetchOptions = (vItem: any) => {
    return new Promise((resolve, reject) => {
      if (!vItem.entryBody.asyncOptions) {
        resolve([])
        return
      }
      const ao = vItem.entryBody.asyncOptions
      const { request, dataField, requestParams, transform } = ao
      let params = {}
      if (requestParams) {
        const pa = requestParams(otherParams)
        params = isType(pa, 'Object') ? pa : {}
      }

      request(params, collectAsyncOptionsRes).then(
        (res: any) => {
          // 搜集所有的options异步获取时的数据，以免二次请求
          collectAsyncOptionsRes[vItem.name] = res
          let data = dataField ? dataByField(dataField, res) : res
          if (transform) {
            data = transform(data, collectAsyncOptionsRes) || []
          }
          emit('options:async', data, vItem, collectAsyncOptionsRes, items)
          resolve(data)
        },
        (err: any) => reject(err)
      )
    })
  }

  items.forEach(async (vItem: any) => {
    if (vItem.entryBody && vItem.entryBody.asyncOptions) {
      if (relate && relate.length > 0) {
        if (relate.includes(vItem.name)) {
          vItem.entryBody.options = await fetchOptions(vItem)
        }
      } else {
        vItem.entryBody.options = await fetchOptions(vItem)
      }
    }
  })
}

/**
 * 处理items
 * @param props
 * @returns
 */
export function useItems(props: propsType) {
  const enrtyItems = ref(props.items)

  watch(
    () => props.items,
    () => {
      transformItems([addFixProps, handleItemsLayout, handleItemsShow], enrtyItems.value)
    },
    { deep: true, immediate: true }
  )

  // 对传进来的所有items进行一些处理
  return { enrtyItems }
}
function setIinitValueByValueType(item: any) {
  if (!item.defaultValue) {
    switch (item.valueType) {
      case 'Object':
        item.defaultValue = {}
        break
      case 'Boolean':
        item.defaultValue = false
        break
      case 'Number':
        item.defaultValue = 0
        break
      default:
        item.defaultValue = undefined
    }
  }
}

/**
 * 处理items的值
 * @param props
 * @param emit
 * @returns
 */
export function useValues(props: propsType, items: any, collectAsyncOptionsRes: any, emit: any) {
  const enrtyItemsValue: any = ref({})
  const initialVal: any = ref({})
  let firstFlag = true
  const errorsMsg: any = ref({})
  const itemRules: any = ref(props.rules)

  /**
   * 值初始化
   */
  function setDefaultValue() {
    const defaultValue: any = {}

    items.forEach((n: any) => {
      setIinitValueByValueType(n)
      defaultValue[n.name] = n.defaultValue
      // 将初始值缓存，以便重置使用
      initialVal.value[n.name] = cloneDeep(n.defaultValue)
    })
    enrtyItemsValue.value = defaultValue
  }
  setDefaultValue()

  watch(
    () => props.initialValue,
    (val: any) => {
      /**
       * 这里处理异步情况下获取初始值
       */
      if (firstFlag && Reflect.ownKeys(val).length !== 0) {
        for (const k in val) {
          // if (val[k]._isAMomentObject) {
          //   throw new Error('initialValue不用传入moment对象')
          // }
          enrtyItemsValue.value[k] = val[k]
          // 将初始值缓存，以便重置使用
          initialVal.value[k] = cloneDeep(val[k])
        }
        firstFlag = false
      }
    },
    { deep: true, immediate: true }
  )

  // 重置
  function reset() {
    for (const i in enrtyItemsValue.value) {
      if (!Reflect.has(initialVal.value, i)) {
        enrtyItemsValue.value[i] = undefined
      } else {
        enrtyItemsValue.value[i] = cloneDeep(initialVal.value[i])
      }
      // handleInitMomentVal(formData, i, fItems, initialVal)
    }
  }

  /**
   * 输入值发生变化时，一般是change触发，只用于内部组件
   * @param e
   * @param item
   */
  function valueChange(e: any, item: any) {
    let val = e
    if (e.target) {
      val = e.target.value
    }
    emit('item:change', val, item.name, enrtyItemsValue.value, props.itemsKey, item)
    if (item.relate && item.relate.length > 0) {
      item.relate.forEach((name: string) => {
        enrtyItemsValue.value[name] = ''
      })
      handleAsyncOptions(items, emit, collectAsyncOptionsRes, enrtyItemsValue.value, item.relate)
    }
    // 值改变时，触发验证
    validateValues(item.name)
  }

  /**
   * 手动设置某个属性值
   * @param val
   * @param key
   */
  function setValues(val: any, key: any) {
    enrtyItemsValue.value[key] = val
  }

  /**
   * 处理验证错误
   * @param errors
   * @param fields
   */
  function handleErrors(errors: any, fields: any) {
    errors.forEach((item: any) => {
      errorsMsg.value[item.field] = item
    })
  }

  /**
   * 验证字段
   * @param name 用于只针对某个属性验证
   * @returns
   */
  function validateValues(name?: any) {
    return new Promise((resolve, reject) => {
      const rus: any = props.rules
      let rule = { ...rus }
      if (name && !rus[name]) return
      if (name) {
        errorsMsg.value[name] = undefined
        rule = {
          [name]: rus[name]
        }
      } else {
        errorsMsg.value = {}
      }

      const validator = new Schema(rule)
      validator
        .validate(enrtyItemsValue.value)
        .then(() => {
          resolve(enrtyItemsValue.value)
        })
        .catch(({ errors, fields }) => {
          return handleErrors(errors, fields)
        })
    })
  }

  /**
   * 获取当前所有的值
   * @param isValidate 是否需要验证
   * @param filterNoUse 是否需要过滤无意义字段，如空字符串
   * @returns
   */
  function getValues(isValidate?: any, filterNoUse = false) {
    return new Promise((resolve, reject) => {
      if (!isValidate) {
        resolve(trimNoUseFeilds(enrtyItemsValue.value, filterNoUse))
      } else {
        validateValues().then((data: any) => {
          resolve(trimNoUseFeilds(data, filterNoUse))
        })
      }
    })
  }

  return {
    enrtyItemsValue,
    reset,
    valueChange,
    setValues,
    getValues,
    errorsMsg,
    itemRules
  }
}

/**
 * 用于处理异步options
 * @param props
 * @param items
 * @param emit 事件
 * @param enrtyItemsValue 所有值
 * @returns
 */
export function useOptions(props: propsType, items: any, emit: any, enrtyItemsValue: any) {
  const collectAsyncOptionsRes = reactive({})
  const otherData = {} // 用来搜集其他参数

  // 处理异步options
  handleAsyncOptions(items, emit, collectAsyncOptionsRes, otherData, null)

  return {
    collectAsyncOptionsRes
  }
}

/**
 * 手动处理各个item的props
 * @param props
 * @param enrtyItems
 * @param enrtyItemsValue
 * @returns
 */
export function useItemsProps(props: propsType, enrtyItems: any, enrtyItemsValue: any) {
  /**
   * 专门用来修改显示/隐藏
   * @param show 显示/隐藏
   * @param hideFields 涉及的字段
   */
  const toggleVisble = (show: boolean, hideFields: Array<any>) => {
    enrtyItems.value.forEach((item: any) => {
      if (hideFields.includes(item.name)) {
        item.show = show
      }
    })
  }

  /**
   * 专门用来修改每个item的props
   * @param callback 回调函数
   * @param name 哪个属性
   */
  const changeItemsProps = (callback: any, name: string) => {
    enrtyItems.value.forEach((item: any) => {
      if (name === item.name) {
        callback && callback(item, enrtyItemsValue.value[name])
      }
    })
  }

  return {
    toggleVisble,
    changeItemsProps
  }
}
