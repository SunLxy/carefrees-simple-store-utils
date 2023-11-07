
import type { CSTU_Instance } from "./CSTU_Instance"

export type CSTU_IntType = string | number | boolean | symbol

export type CSTU_PathTypes = number | string | (number | string)[]

/**实现构造器类型**/
export interface CSTU_ClassInterface<T> {
  new(): T
}

export interface CSTU_InstanceProviderProps<K = CSTU_Instance, T = any> {
  /**实例*/
  instance?: K
  /**内容*/
  children?: React.ReactNode
}

export interface Use_CSTU_InstanceItemRegisterProps {
  /**注册地址*/
  path: CSTU_PathTypes,
  /**唯一值*/
  uid?: Symbol
}

export interface CSTU_RegisterProps {
  /**注册地址*/
  path: CSTU_PathTypes,
  /**更新当前组件方法*/
  update: Function
  /**是否保存*/
  preserve?: boolean
  /**唯一值*/
  uid?: Symbol
}

export interface CSTU_RegisterWatchProps {
  /**监听字段存储地址*/
  path: CSTU_PathTypes,
  /**更新当前组件方法*/
  update: (value: any) => void
  /**唯一值*/
  uid?: Symbol
}

export interface CSTU_SelectorListItemType<T extends CSTU_Instance = CSTU_Instance, TState = unknown, Selected = unknown,> {
  /**上一次值*/
  preValue: TState
  /**更新组件方法*/
  updateData: (value: Selected) => void
  /**获取最新数据的 执行方法*/
  selector: (instance: T) => Selected,
  /**新老数据对比方法*/
  equalityFn?: (a: TState, b: TState) => boolean
}
