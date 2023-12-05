
import { CSTU_PathTypes } from "../CSTU_interface"
import { CSTU_setValue } from "./CSTU_setValue"
import { CSTU_toArray } from "."

/**链式调用更新数据*/
export class CSTU_update<T = any> {

  /**初始值*/
  private initialValue: T;

  constructor(init?: T) {
    this.initialValue = init || this.getValue(true)
  }

  /**判断值是否存在*/
  private checkValue = (value: any) => {
    if (typeof value === "boolean" || typeof value === "number") {
      return value
    } else if (value) {
      return value
    }
    return null
  }

  /**获取值*/
  getValue(fig: boolean = false): T {
    if (fig) {
      const result = this.checkValue(this.initialValue)
      if (result === null) {
        this.initialValue = {} as T
      } else {
        this.initialValue = result
      }
      return this.initialValue
    }
    return this.initialValue
  }

  /**初始化值*/
  init = (init?: T) => {
    this.initialValue = init || this.getValue(true)
    return this;
  }

  /**更新值*/
  update = (path: CSTU_PathTypes | Function, value?: any) => {
    if (Array.isArray(path) && path.length === 0) {
      this.initialValue = value
    } else if (typeof path === "function") {
      const result = path(this.initialValue)
      if (result === null) {
        this.initialValue = result
      } else {
        const data = this.checkValue(result)
        if (data !== null) {
          this.initialValue = data
        }
      }
    } else {
      this.initialValue = CSTU_setValue(this.initialValue, CSTU_toArray(path), value)
    }
    return this
  }
}
