import { useRef, useMemo, createElement, createContext, useContext, useState, useEffect } from "react"
import {
  CSTU_ClassInterface,
  CSTU_InstanceProviderProps,
  UseSTU_ItemRegister,
  PathTypes
} from "../CSTU_interface"
import { CSTU_Instance } from "../CSTU_Instance"
import { CSTU_isEqual } from "./../utils"

/**
 * 创建====Context 
 * @param instance 默认初始实例
 * 
 * @example
 * 
 * const context = createCSTU_Context(new CSTU_Instance())
 * 
 * */
export const createCSTU_Context = <T extends CSTU_Instance>(instance: T) => createContext(instance)

/**
 * 创建==== 初始实例化 hooks
 * @param Instance class实例
 * 
 * @example 
 * 
 * const useInitInstance = createuseCSTU_Instance(CSTU_Instance)
 * 
 */
export function createuseCSTU_Instance<T extends CSTU_Instance = CSTU_Instance>(InstanceClas: CSTU_ClassInterface<T>) {

  /**
  * @param instance 实例
  * 
  * @example
  * 
  * 第一种
  * const instance = useCSTU_Instance()
  * 
  * 第二种
  * const initInstance = new CSTU_Instance()
  * const instance = useCSTU_Instance(initInstance)
  * 
  * */
  return function useCSTU_Instance(instance?: T) {
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
 * @param useCSTU_Instance 获取实例
 * @param Context 
 * @param initFunName 初始值方法名称
 * 
 * @example
 * 
 * const context = createCSTU_Context(new CSTU_Instance())
 * 
 * const useInstance = createuseCSTU_Instance(CSTU_Instance)
 * 
 * const Provider = createSTU_InstanceProvider(useInstance,context,"方法名")
 * 
*/
export function createSTU_InstanceProvider<T extends CSTU_Instance = CSTU_Instance>(
  useCSTU_Instance: (instance?: T) => T[],
  Context: React.Context<T>,
  initFunName?: string
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
    const [instance] = useCSTU_Instance(parentInstance)

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
 * const context = createCSTU_Context(new CSTU_Instance())
 * 
 * const useContextInstance = createSTU_useContextInstance(context)
 * 
 * */
export function createSTU_useContextInstance<T extends CSTU_Instance = CSTU_Instance>(Context: React.Context<T>) {
  return function useContextInstance() {
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
 * const context = createCSTU_Context(new CSTU_Instance())
 * 
 * const useItemRegister = createSTU_useInstanceItemRegister(context,"方法名称")
 * 
 * 
*/
export function createSTU_useInstanceItemRegister<T extends CSTU_Instance = CSTU_Instance>(
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
  * const initInstance = useSTU_ItemRegister({ path:["a","b","c"] })
  * 
  * 第二种
  * 
  * const initInstance = useSTU_ItemRegister({ path:"a" })
  * 
  */
  return function useSTU_ItemRegister(props: UseSTU_ItemRegister) {
    const { path } = props
    const refUpdate = useSTU_Update()
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
 * const useFieldWatch = createSTU_useInstanceFieldWatch("方法名称")
 * 
*/
export function createSTU_useInstanceFieldWatch<T extends CSTU_Instance = CSTU_Instance>(registerWatchFunName: string) {

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
  * const instance = useCSTU_Instance()
  * 
  * 第一种
  * const value = useFieldWatch(initInstance,["a", "b", "c])
  * 
  * 第二种
  * useFieldWatch(initInstance, ["a", "b", "c],(value)=>console.log(value))
  * 
  */
  return function useSTU_FieldWatch(instance: T, path: PathTypes, fun?: (value: any) => void) {
    const refValue = useRef<any>()
    const ref = useRef<(value: any) => void>(() => void 0)

    const refUpdate = useSTU_Update()

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
 * @param useCSTU_Instance 获取实例
 * @param registerSelectorFunName 注册执行器的方法名称
 * @param getSelectorValueFunName 获取最新值的方法名称
 * 
 * @example
 * 
 * const context = createCSTU_Context(new CSTU_Instance())
 * 
 * const useInstance = createuseCSTU_Instance(CSTU_Instance)
 * 
 * const useSelector = createSTU_useSelector(useInstance,"注册执行器的方法名称","获取最新值的方法名称")
 * 
 * 
*/
export function createSTU_useSelector<K extends CSTU_Instance = CSTU_Instance>(
  useCSTU_Instance: (instance?: K) => K[],
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
  * const value = useSelector((instance) => ({ a:instance.formData, c:instance.formData })) 
  * 
  * console.log(value)
  * 
  */
  return function useSTU_Selector<Selected = any>(
    selector: (state: K) => Selected,
    equalityFn: (a: any, b: any) => boolean = CSTU_isEqual
  ) {
    const instance = useCSTU_Instance()
    const refUpdate = useSTU_Update()
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
export const useSTU_Update = () => {
  const [, _update] = useState({})
  /**为了防止 hooks 闭包问题*/
  const refUpdate = useRef<Function>()
  refUpdate.current = () => {
    _update({})
  }
  return refUpdate
}
