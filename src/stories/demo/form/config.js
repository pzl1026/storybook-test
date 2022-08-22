const list = [
  {
    id: 1,
    name: 'name1'
  },
  {
    id: 2,
    name: 'name2'
  }
]

const options = [
  {
    value: 1,
    label: 'option1'
  },
  {
    value: 2,
    label: 'option2'
    // disabled: true
  }
]

// mock options
function getOptions() {
  return new Promise((resolve, reject) => {
    resolve({
      list
    })
  })
}

export const items = [
  {
    label: 'item1',
    name: 'a1',
    type: 'input',
    required: true,
    defaultValue: ''
  },
  {
    label: 'item2',
    name: 'a2',
    type: 'select',
    defaultValue: 1,
    entryBody: {
      options
    }
  },
  {
    label: 'item3',
    name: 'a3',
    type: 'radio-group',
    entryBody: {
      options
    }
  },
  {
    label: 'item4',
    name: 'a4',
    type: 'sc-radio-button', // 自定义的组件
    entryBody: {
      asyncOptions: {
        request: getOptions,
        dataField: 'list',
        transform(data) {
          return data.map((item) => {
            return {
              ...item,
              label: item.name,
              value: item.id
            }
          })
        }
      }
    }
  },
  {
    label: 'item5',
    name: 'a5',
    defaultValue: {
      v1: '111',
      v2: '2222'
    },
    slot: {
      entry: 'item5-entry' // entry的插槽优先级最高，会覆盖type属性和其他slot，完全是自定义样式
    }
  },
  {
    label: 'item6',
    name: 'a6',
    type: 'input',
    required: true,
    slot: {
      entryRight: 'item6-entry-right',
      entryBelow: 'item6-entry-below',
      below: 'item6-below',
      label: 'item6-label'
    }
  },
  {
    label: 'item7',
    name: 'a7',
    type: 'select'
  }
]
export const rules = {
  a1: {
    type: 'string',
    required: true,
    message: '填写不正确'
    // validator: (rule, value) => value === 'muji'
  },
  a6: {
    type: 'string',
    required: true,
    message: '输入的值要大于18',
    validator: (rule, value) => {
      return new Promise((resolve, reject) => {
        if (value <= 18 || !value) {
          reject('too young') // reject with error message
        } else {
          resolve()
        }
      })
    }
  }
}

export const formItemsAll = [
  {
    key: 'items1',
    items,
    rules
  }
]
