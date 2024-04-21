import { useRef, createElement, createContext, useContext, useState, useEffect } from "react"
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector'

import {
  CSTU_ClassInterface,
  CSTU_InstanceProviderProps,
  Use_CSTU_InstanceItemRegisterProps,
  CSTU_PathTypes
} from "../CSTU_interface"
import { CSTU_Instance } from "../CSTU_Instance"
import { CSTU_isEqual } from "./../utils"
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports

/**
 * 创建====Context 
 * @param instance 默认初始实例
 * 
 * @example
 * 
 * const context = create_CSTU_InstanceContext(new CSTU_Instance())
 * 
 * */
export const create_CSTU_InstanceContext = <T = CSTU_Instance>(instance: T) => createContext(instance)

/**
 * 创建==== 初始实例化 hooks
 * @param Instance class实例
 * 
 * @example 
 * 
 * const useInitInstance = create_CSTU_Hooks_Instance(CSTU_Instance)
 * 
 */
export function create_CSTU_Hooks_Instance<T = CSTU_Instance>(InstanceClas: CSTU_ClassInterface<T>) {

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
 * const Provider = create_CSTU_InstanceProvider(use_CSTU_Instance,context)
 * 
*/
export function create_CSTU_InstanceProvider<T = CSTU_Instance>(
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
export function create_CSTU_hooks_InstanceContext<T = CSTU_Instance>(Context: React.Context<T>) {
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
export function create_CSTU_hooks_InstanceItemRegister<T = CSTU_Instance>(
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
    const { path, uid } = props
    const refUpdate = use_CSTU_Update()
    const instance = useContext<T>(Context)
    const current_uid = useRef(uid || Symbol("instance_item_register"))
    /**更新组件方法注册*/
    useEffect(() => {
      let unRegister: Function;
      if (registerFunName) {
        unRegister = instance[registerFunName]({
          path,
          update: refUpdate.current,
          uid: current_uid.current
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
export function create_CSTU_hooks_InstanceFieldWatch<T = CSTU_Instance>(registerWatchFunName: string) {

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
    const current_uid = useRef(Symbol("instance_field_watch_register"))
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
          update: ref.current,
          uid: current_uid.current
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
 * @param listenerField 监听方法存储数据字段
 * 
 * @example
 * 
 * const context = create_CSTU_InstanceContext(new CSTU_Instance())
 * 
 * const useInstanceContext = create_CSTU_hooks_InstanceContext(instanceContext)
 * 
 * const use_CSTU_InstanceSelector = create_CSTU_hooks_InstanceSelector(useInstance,"监听方法存储数据字段")
 * 
*/
export function create_CSTU_hooks_InstanceSelector<K extends CSTU_Instance = CSTU_Instance>(
  useInstanceContext: (instance?: K) => K,
  listenerField: string,
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
    selector: (state: { instance: K }) => Selected,
    equalityFn: (a: any, b: any) => boolean = CSTU_isEqual
  ) {
    const instance = useInstanceContext()
    const slice = useSyncExternalStoreWithSelector(
      instance._crate_CSTU_registerSubscribe(listenerField),
      instance._create_CSTU_getState,
      instance._create_CSTU_getInitialState,
      selector,
      equalityFn,
    )
    return slice as Selected
  }
}

/**
 * 更新页面状态
 * */
export const use_CSTU_Update = () => {
  const [, _update] = useState({})
  /**为了防止 hooks 闭包问题*/
  const refUpdate = useRef<Function>(() => void 0)
  refUpdate.current = () => {
    _update({})
  }
  return refUpdate
}

/**
 * 创建一套状态管理
 * @param instance 实例
 * @param registerFunName 注册方法名称
 * @param registerWatchFunName 注册监听器的方法名称
 * @param registerSelectorFunName 注册执行器的方法名称
 * @param getSelectorValueFunName 获取最新值的方法名称
*/
export const create_CSTU_Hooks = <T extends CSTU_Instance = CSTU_Instance>(instance: CSTU_ClassInterface<T>, registerFunName: string, registerWatchFunName: string = "watchMapData", listenerField: string = 'listenerSetData') => {
  /**创建hooks*/
  /**创建实例状态上下文*/
  const instanceContext = create_CSTU_InstanceContext<T>(new instance())
  /**获取或者声明实例*/
  const useInstance = create_CSTU_Hooks_Instance(instance)
  /** Provider  */
  const InstanceProvider = create_CSTU_InstanceProvider(useInstance, instanceContext)
  /**获取上下文实例*/
  const useInstanceContext = create_CSTU_hooks_InstanceContext(instanceContext)
  /**注册当前组件*/
  const useInstanceItemRegister = create_CSTU_hooks_InstanceItemRegister(instanceContext, registerFunName)
  /**监听字段值变化*/
  const useInstanceFieldWatch = create_CSTU_hooks_InstanceFieldWatch(registerWatchFunName)
  /**Selector 执行器 ,允许您使用选择器函数从存储状态中提取数据以供此组件使用。*/
  const useInstanceSelector = create_CSTU_hooks_InstanceSelector(useInstanceContext, listenerField)
  return {
    instanceContext,
    useInstance,
    useInstanceContext,
    InstanceProvider,
    useInstanceItemRegister,
    useInstanceFieldWatch,
    useInstanceSelector,
  }
}