interface ItemsValue {
  [key: string]: any
}

export interface propsType {
  itemsKey: string
  items: Array<any>
  // itemsValue: ItemsValue
  initialValue: ItemsValue
  setItemVal: () => void
  [key: string]: any
}
