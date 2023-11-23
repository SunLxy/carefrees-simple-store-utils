# 状态管理基础api

## 基础类

```ts
// CSTU_Instance.ts 

import { CSTU_PathTypes, CSTU_RegisterProps, CSTU_RegisterWatchProps, CSTU_SelectorListItemType } from "./CSTU_interface";
export declare class CSTU_Instance {
    /**
     * 基础创建方法=====>获取数组数据
     * @param field 字段
     * */
    _get_CSTU_list: <K>(field: string) => K[];
    /**
     * 基础创建方法=====>获取对象数据
     * @param field 字段
    */
    _get_CSTU_store: <R = any>(field: string) => R;
    /**
     * 基础创建方法=====>获取 Map 对象数据
     * @param field 字段
     * */
    _get_CSTU_map: (field: string) => Map<Symbol | Object, CSTU_SelectorListItemType>;
    /**
     * 基础创建方法=====>注册组件
     * @param componentField 挂载组件存储 字段
     * @param storeField  操作数据存储 字段
     * @param initialField  初始值存储 字段
     * @param props 内部操作参数
     * @param prototype 是否在不改变原始数据存储地址方式直接更新值 (默认false)
     *
     * */
    _create_CSTU_register: <R = any>(componentField: string, storeField: string, initialField: string, props: CSTU_RegisterProps, prototype?: boolean) => () => void;
    /**
     * 基础创建方法=====>注册监听字段
     * @param watchField  挂载监听组件存储 字段
     * @param props 内部操作参数
     * */
    _create_CSTU_registerWatch: (watchField: string, props: CSTU_RegisterWatchProps) => () => void;
    /**
     * 基础创建方法=====>通知组件更新
     * @param componentField 挂载组件存储 字段
     * @param path 更新组件路径
     * */
    _create_CSTU_notice: (componentField: string, path: CSTU_PathTypes) => void;
    /**
     * 基础创建方法=====>批量更新组件， 当不传递值的时候，更新所有组件
     * @param componentField 挂载组件存储 字段
     * @param paths 更新组件路径集合
     *
    */
    _create_CSTU_bathNotice: (componentField: string, paths?: string[] | boolean) => void;
    /**
     * 基础创建方法=====>通知监听
     * @param watchField  挂载监听组件存储 字段
     * @param storeField  操作数据存储 字段
     * @param path 通知监听器的路径值更新
     * */
    _create_CSTU_noticeWatch: (watchField: string, storeField: string, path: CSTU_PathTypes) => void;
    /**
     * 基础创建方法=====>更新值
     * @param componentField 挂载组件存储 字段
     * @param storeField  操作数据存储 字段
     * @param watchField  挂载监听组件存储 字段
     * @param path 更新数据路径
     * @param value 数据
     * @param notice 通知更新
     * @param prototype 是否不改变原始数据存储地址方式直接更新值 (默认false)
     *
     * */
    _create_CSTU_updateValue: <K = any>(componentField: string, storeField: string, watchField: string | undefined | null, path: CSTU_PathTypes, value: K, notice?: boolean | string[], prototype?: boolean) => void;
    /**
     * 基础创建方法=====>批量数据更新
     * @param componentField 挂载组件存储 字段
     * @param storeField  操作数据存储 字段
     * @param watchField  挂载监听组件存储 字段
     * @param values 存储的数据
     * @param notice 通知更新
     * @param prototype 是否不改变原始数据存储地址方式直接更新值 (默认false)
     * */
    _create_CSTU_bathUpdateValue: (componentField: string, storeField: string, watchField: string | undefined | null, values: Record<string, any>, notice?: boolean | string[], prototype?: boolean) => void;
    /**
     * 基础创建方法=====>获取值
     * @param storeField  操作数据存储 字段
     * @param path 获取数据的路径
     * */
    _create_CSTU_getValue: (storeField: string, path?: CSTU_PathTypes) => any;
    /**
     * 基础创建方法=====>设置初始值
     * @param storeField  操作数据存储 字段
     * @param initialField  操作数据存储 字段
     * @param initialValue 初始值存储 字段
     * @param prototype 是否不改变原始数据存储地址方式存储 (默认false)
     *
    */
    _create_CSTU_init: <T = any>(storeField: string, initialField: string, initialValue?: T, prototype?: boolean) => void;
    /**
     * 基础创建方法=====> 数据更新,执行选择器(暂时 直接手动调用)
     * @param selectorMapField  执行器方法集合存储 字段
     * @param storeField  操作数据存储 字段
     *
    */
    _create_CSTU_bathRunSelector: (selectorMapField: string) => void;
    /**
     * 基础创建方法=====>注册 选择器函数，存储状态中提取数据以供此组件
     * @param selectorMapField  执行器方法集合存储 字段
     * @param key  map集合 设置值的唯一key值
     * @param selectorFn  获取最新数据的 执行方法
     * @param updateData  组件更新方法
     * @param equalityFn  新老数据对比方法
    */
    _create_CSTU_registerSelector: <Selected = unknown, T extends CSTU_Instance = CSTU_Instance>(selectorMapField: string, key: Object | Symbol, selectorFn: (instance: T) => Selected, updateData: (value: Selected) => void, equalityFn?: (a: any, b: any) => boolean) => {
        data: Selected;
        unMount: () => void;
    };
    /**
     * 基础创建方法=====>选择器 获取值
     * @param selectorMapField  执行器方法集合存储 字段
     * @param storeField  操作数据存储 字段
     * @param key   从 map集合 取值唯一key值
     * */
    _create_CSTU_getSelectorValue: (selectorMapField: string, key: Object | Symbol) => unknown;
}


```

## 创建`react`使用相关`hooks`方法

```ts
// hooks/index.ts 

import { CSTU_ClassInterface, CSTU_InstanceProviderProps, Use_CSTU_InstanceItemRegisterProps, CSTU_PathTypes } from "../CSTU_interface";
import { CSTU_Instance } from "../CSTU_Instance";
/**
 * 创建====Context
 * @param instance 默认初始实例
 *
 * @example
 *
 * const context = create_CSTU_InstanceContext(new CSTU_Instance())
 *
 * */
export declare const create_CSTU_InstanceContext: <T = CSTU_Instance>(instance: T) => import("react").Context<T>;
/**
 * 创建==== 初始实例化 hooks
 * @param Instance class实例
 *
 * @example
 *
 * const useInitInstance = create_CSTU_Hooks_Instance(CSTU_Instance)
 *
 */
export declare function create_CSTU_Hooks_Instance<T = CSTU_Instance>(InstanceClas: CSTU_ClassInterface<T>): (instance?: T) => T[];
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
export declare function create_CSTU_InstanceProvider<T = CSTU_Instance>(use_CSTU_Instance: (instance?: T) => T[], Context: React.Context<T>): (props: CSTU_InstanceProviderProps<T>) => import("react").FunctionComponentElement<import("react").ProviderProps<T>>;
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
export declare function create_CSTU_hooks_InstanceContext<T = CSTU_Instance>(Context: React.Context<T>): () => T;
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
export declare function create_CSTU_hooks_InstanceItemRegister<T = CSTU_Instance>(Context: React.Context<T>, registerFunName: string): (props: Use_CSTU_InstanceItemRegisterProps) => T;
/**
 * 创建====注册监听字段更新
 * @param registerWatchFunName 注册监听器的方法名称
 *
 * @example
 *
 * const use_CSTU_InstanceFieldWatch = create_CSTU_hooks_InstanceFieldWatch("方法名称")
 *
*/
export declare function create_CSTU_hooks_InstanceFieldWatch<T = CSTU_Instance>(registerWatchFunName: string): (instance: T, path: CSTU_PathTypes, fun?: (value: any) => void) => any;
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
export declare function create_CSTU_hooks_InstanceSelector<K = CSTU_Instance>(use_CSTU_Instance: (instance?: K) => K[], registerSelectorFunName: string, getSelectorValueFunName: string): <Selected = any>(selector: (state: K) => Selected, equalityFn?: (a: any, b: any) => boolean) => Selected;
/**
 * 更新页面状态
 * */
export declare const use_CSTU_Update: () => import("react").MutableRefObject<Function>;

/**
 * 创建一套状态管理
 * @param instance 实例
 * @param registerFunName 注册方法名称
 * @param registerWatchFunName 注册监听器的方法名称
 * @param registerSelectorFunName 注册执行器的方法名称
 * @param getSelectorValueFunName 获取最新值的方法名称
*/
export declare const create_CSTU_Hooks: <T = CSTU_Instance>(instance: CSTU_ClassInterface<T>, registerFunName: string, registerWatchFunName?: string, registerSelectorFunName?: string, getSelectorValueFunName?: string) => {
    instanceContext: import("react").Context<T>;
    useInstance: (instance?: T) => T[];
    useInstanceContext: () => T;
    InstanceProvider: (props: CSTU_InstanceProviderProps<T, any>) => import("react").FunctionComponentElement<import("react").ProviderProps<T>>;
    useInstanceItemRegister: (props: Use_CSTU_InstanceItemRegisterProps) => T;
    useInstanceFieldWatch: (instance: CSTU_Instance, path: CSTU_PathTypes, fun?: (value: any) => void) => any;
    useInstanceSelector: <Selected = any>(selector: (state: T) => Selected, equalityFn?: (a: any, b: any) => boolean) => Selected;
};
```

## 类型

```ts
// CSTU_interface.ts 

import type { CSTU_Instance } from "./CSTU_Instance";

export type CSTU_IntType = string | number | boolean | symbol;
export type CSTU_PathTypes = number | string | (number | string)[];

/**实现构造器类型**/
export interface CSTU_ClassInterface<T> {
    new (): T;
}
export interface CSTU_InstanceProviderProps<K = CSTU_Instance, T = any> {
    /**实例*/
    instance?: K;
    /**内容*/
    children?: React.ReactNode;
}
export interface Use_CSTU_InstanceItemRegisterProps {
    /**注册地址*/
    path: CSTU_PathTypes;
}
export interface CSTU_RegisterProps {
    /**注册地址*/
    path: CSTU_PathTypes;
    /**更新当前组件方法*/
    update: Function;
    /**是否保存*/
    preserve?: boolean;
}
export interface CSTU_RegisterWatchProps {
    /**监听字段存储地址*/
    path: CSTU_PathTypes;
    /**更新当前组件方法*/
    update: (value: any) => void;
}
export interface CSTU_SelectorListItemType<T extends CSTU_Instance = CSTU_Instance, TState = unknown, Selected = unknown> {
    /**上一次值*/
    preValue: TState;
    /**更新组件方法*/
    updateData: (value: Selected) => void;
    /**获取最新数据的 执行方法*/
    selector: (instance: T) => Selected;
    /**新老数据对比方法*/
    equalityFn?: (a: TState, b: TState) => boolean;
}



```
