
import type { CSTU_Instance } from "./CSTU_Instance"

export type IntType = string | number | boolean | symbol

export type PathTypes = number | string | (number | string)[]


/**实现构造器类型**/
export interface CSTU_ClassInterface<T> {
  new(): T
}

export interface CSTU_InstanceProviderProps<K extends CSTU_Instance = CSTU_Instance, T = any> {
  /**实例*/
  instance?: K
  /**内容*/
  children?: React.ReactNode
}

export interface UseSTU_ItemRegister {
  path: PathTypes,
}

export interface CSTU_RegisterProps {
  path: PathTypes,
  update: Function
  /**是否保存*/
  preserve?: boolean
}

export interface CSTU_RegisterWatchProps {
  path: PathTypes,
  update: (value: any) => void
}

export interface CSTU_SelectorListItemType<T extends CSTU_Instance = CSTU_Instance, TState = unknown, Selected = unknown,> {
  preValue: TState
  updateData: (value: Selected) => void
  selector: (instance: T) => Selected,
  equalityFn?: (a: TState, b: TState) => boolean
}
