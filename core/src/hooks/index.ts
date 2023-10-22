import { useRef, createElement, createContext, useContext, useState, useEffect } from "react"
import {
  CSTU_ClassInterface,
  CSTU_InstanceProviderProps,
  Use_CSTU_InstanceItemRegisterProps,
  CSTU_PathTypes
} from "../CSTU_interface"
import { CSTU_Instance } from "../CSTU_Instance"
import { CSTU_isEqual } from "./../utils"

/**
 * 创建====Context 
 * @param instance 默认初始实例
 * 
 * @example
 * 
 * const context = create_CSTU_InstanceContext(new CSTU_Instance())
 * 
 * */
export const create_CSTU_InstanceContext = <T extends CSTU_Instance>(instance: T) => createContext(instance)

/**
 * 创建==== 初始实例化 hooks
 * @param Instance class实例
 * 
 * @example 
 * 
 * const useInitInstance = create_CSTU_Hooks_Instance(CSTU_Instance)
 * 
 */
export function create_CSTU_Hooks_Instance<T extends CSTU_Instance = CSTU_Instance>(InstanceClas: CSTU_ClassInterface<T>) {

  /**
  * @param instance 实例
  * 
  * @example
  * 
  * 第一种
  * const instance = use_CSTU_Instance()
  * 
  * 第二种
  * const initInstance = new CSTU_Instance()
  * const instance = use_CSTU_Instance(initInstance)
  * 
  * */
  return function use_CSTU_Instance(instance?: T) {
    const instanceRef = useRef<T>(null)
    if (!instanceRef.current) {
      if (instance) {
        instanceRef.current = instance
      } else {
        instanceRef.current = new InstanceClas()
      }
    }
    return [instanceRef.current as T]
  }
}

/**
 * 创建====Provider 
 * @param use_CSTU_Instance 获取实例
 * @param Context 
 * 
 * @example
 * 
 * const context = create_CSTU_InstanceContext(new CSTU_Instance())
 * 
 * const use_CSTU_Instance = create_CSTU_Hooks_Instance(CSTU_Instance)
 * 
 * const Provider = create_CSTU_InstanceProvider(use_CSTU_Instance,context,"方法名")
 * 
*/
export function create_CSTU_InstanceProvider<T extends CSTU_Instance = CSTU_Instance>(
  use_CSTU_Instance: (instance?: T) => T[],
  Context: React.Context<T>,
) {

  /**
  * 
  * @param instance 实例
  * @param initialValue 初始值
  * 
  * 
  * @example
  * 
  * 第一种
  * <Provider>这是内容</Provider>
  * 
  * 第二种
  * 
  * const initInstance = new CSTU_Instance()
  * 
  * <Provider instance={initInstance} >这是内容</Provider>
  * 
  */
  return function CSTU_InstanceProvider(props: CSTU_InstanceProviderProps<T>) {

    const { instance: parentInstance, children, } = props
    const [instance] = use_CSTU_Instance(parentInstance)

    return createElement(Context.Provider, {
      value: instance,
      children
    })
  }
}

/**
 * 创建====获取当前的状态管理实例
 * @param Context 
 * 
 * @example
 * 
 * const context = create_CSTU_InstanceContext(new CSTU_Instance())
 * 
 * const use_CSTU_InstanceContext = create_CSTU_hooks_InstanceContext(context)
 * 
 * */
export function create_CSTU_hooks_InstanceContext<T extends CSTU_Instance = CSTU_Instance>(Context: React.Context<T>) {
  return function use_CSTU_InstanceContext() {
    return useContext<T>(Context)
  }
}

/**
 * 创建====子组件注册更新
 * @param Context 
 * @param registerFunName 注册方法名称
 * 
 * @example
 * 
 * const context = create_CSTU_InstanceContext(new CSTU_Instance())
 * 
 * const useItemRegister = create_CSTU_hooks_InstanceItemRegister(context,"方法名称")
 * 
 * 
*/
export function create_CSTU_hooks_InstanceItemRegister<T extends CSTU_Instance = CSTU_Instance>(
  Context: React.Context<T>,
  registerFunName: string
) {

  /**
  * 
  * @param path 组件存储地址路径
  * 
  * @example
  * 
  * 第一种
  * 
  * const initInstance = use_CSTU_InstanceItemRegister({ path:["a","b","c"] })
  * 
  * 第二种
  * 
  * const initInstance = use_CSTU_InstanceItemRegister({ path:"a" })
  * 
  */
  return function use_CSTU_InstanceItemRegister(props: Use_CSTU_InstanceItemRegisterProps) {
    const { path } = props
    const refUpdate = use_CSTU_Update()
    const instance = useContext<T>(Context)
    /**更新组件方法注册*/
    useEffect(() => {
      let unRegister: Function;
      if (registerFunName) {
        unRegister = instance[registerFunName]({
          path,
          update: refUpdate.current
        })
      }
      return () => unRegister?.()
    }, [JSON.stringify(path)])
    return instance
  }
}

/**
 * 创建====注册监听字段更新
 * @param registerWatchFunName 注册监听器的方法名称
 * 
 * @example
 * 
 * const use_CSTU_InstanceFieldWatch = create_CSTU_hooks_InstanceFieldWatch("方法名称")
 * 
*/
export function create_CSTU_hooks_InstanceFieldWatch<T extends CSTU_Instance = CSTU_Instance>(registerWatchFunName: string) {

  /**
  * 
  * @param instance 实例
  * @param path 字段存储地址
  * @param fun 回调方法
  * 
  * @example
  * 
  * 值格式
  * const initialValue = { a:{ b:{ c:1 } } }
  * 实例
  * const instance = use_CSTU_Instance()
  * 
  * 第一种
  * const value = use_CSTU_InstanceFieldWatch(initInstance,["a", "b", "c])
  * 
  * 第二种
  * use_CSTU_InstanceFieldWatch(initInstance, ["a", "b", "c],(value)=>console.log(value))
  * 
  */
  return function use_CSTU_InstanceFieldWatch(instance: T, path: CSTU_PathTypes, fun?: (value: any) => void) {
    const refValue = useRef<any>()
    const ref = useRef<(value: any) => void>(() => void 0)

    const refUpdate = use_CSTU_Update()

    ref.current = (value: any) => {
      refValue.current = value;
      if (typeof fun === "function") {
        fun(value)
      } else {
        refUpdate.current()
      }
    }

    /**更新组件方法注册*/
    useEffect(() => {
      let unRegister: Function;
      if (registerWatchFunName) {
        unRegister = instance[registerWatchFunName]({
          path,
          update: ref.current
        })
      }
      return () => unRegister?.()
    }, [JSON.stringify(path)])

    return refValue.current
  }
}

/**
 * 创建====执行器
 * @param use_CSTU_Instance 获取实例
 * @param registerSelectorFunName 注册执行器的方法名称
 * @param getSelectorValueFunName 获取最新值的方法名称
 * 
 * @example
 * 
 * const context = create_CSTU_InstanceContext(new CSTU_Instance())
 * 
 * const useInstance = create_CSTU_Hooks_Instance(CSTU_Instance)
 * 
 * const use_CSTU_InstanceSelector = create_CSTU_hooks_InstanceSelector(useInstance,"注册执行器的方法名称","获取最新值的方法名称")
 * 
 * 
*/
export function create_CSTU_hooks_InstanceSelector<K extends CSTU_Instance = CSTU_Instance>(
  use_CSTU_Instance: (instance?: K) => K[],
  registerSelectorFunName: string,
  getSelectorValueFunName: string
) {
  /**
  * 
  * @param selector 获取值的执行器
  * @param equalityFn 判断是否更新方法
  * 
  * @example
  *
  * const value = use_CSTU_InstanceSelector((instance) => ({ a:instance.formData, c:instance.formData })) 
  * 
  * console.log(value)
  * 
  */
  return function use_CSTU_InstanceSelector<Selected = any>(
    selector: (state: K) => Selected,
    equalityFn: (a: any, b: any) => boolean = CSTU_isEqual
  ) {
    const instance = use_CSTU_Instance()
    const refUpdate = use_CSTU_Update()
    /**为了解决闭包照成的值不是最新问题*/
    const refSelector = useRef(selector)
    refSelector.current = selector

    /**key值*/
    const refKey = useRef(Symbol("STU_useSelector"))

    const storeRef = useRef(instance?.[registerSelectorFunName]?.(refKey.current, refSelector.current, refUpdate.current, equalityFn))

    useEffect(() => {
      return () => storeRef.current?.unMount?.()
    }, [refKey.current])

    return instance?.[getSelectorValueFunName]?.(refKey.current) as Selected
  }
}

/**
 * 更新页面状态
 * */
export const use_CSTU_Update = () => {
  const [, _update] = useState({})
  /**为了防止 hooks 闭包问题*/
  const refUpdate = useRef<Function>()
  refUpdate.current = () => {
    _update({})
  }
  return refUpdate
}
