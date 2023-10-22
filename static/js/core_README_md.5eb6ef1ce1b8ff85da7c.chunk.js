(self.webpackChunkexamples=self.webpackChunkexamples||[]).push([["core_README_md"],{11771:function(n,e,t){"use strict";t.r(e),t.d(e,{default:function(){return a}});var a={components:{},data:{},source:'# 状态管理基础api\n\n## 基础类\n\n```ts\n// CSTU_Instance.ts \n\nimport { CSTU_PathTypes, CSTU_RegisterProps, CSTU_RegisterWatchProps, CSTU_SelectorListItemType } from "./CSTU_interface";\n\nexport declare class CSTU_Instance {\n    /**\n     * 基础创建方法=====>获取数组数据\n     * @param field 字段\n     * */\n    _get_CSTU_list: <K>(field: string) => K[];\n    /**\n     * 基础创建方法=====>获取对象数据\n     * @param field 字段\n    */\n    _get_CSTU_store: <R = any>(field: string) => R;\n    /**\n     * 基础创建方法=====>获取 Map 对象数据\n     * @param field 字段\n     * */\n    _get_CSTU_map: (field: string) => Map<Symbol | Object, CSTU_SelectorListItemType>;\n    /**\n     * 基础创建方法=====>注册组件\n     * @param componentField 挂载组件存储 字段\n     * @param storeField  操作数据存储 字段\n     * @param initialField  初始值存储 字段\n     * @param props 内部操作参数\n     * @param prototype 是否在不改变原始数据存储地址方式直接更新值 (默认false)\n     *\n     * */\n    _create_CSTU_register: <R = any>(componentField: string, storeField: string, initialField: string, props: CSTU_RegisterProps, prototype?: boolean) => () => void;\n    /**\n     * 基础创建方法=====>注册监听字段\n     * @param watchField  挂载监听组件存储 字段\n     * @param props 内部操作参数\n     * */\n    _create_CSTU_registerWatch: (watchField: string, props: CSTU_RegisterWatchProps) => () => void;\n    /**\n     * 基础创建方法=====>通知组件更新\n     * @param componentField 挂载组件存储 字段\n     * @param path 更新组件路径\n     * */\n    _create_CSTU_notice: (componentField: string, path: CSTU_PathTypes) => void;\n    /**\n     * 基础创建方法=====>批量更新组件， 当不传递值的时候，更新所有组件\n     * @param componentField 挂载组件存储 字段\n     * @param paths 更新组件路径集合\n     *\n    */\n    _create_CSTU_bathNotice: (componentField: string, paths?: string[] | boolean) => void;\n    /**\n     * 基础创建方法=====>通知监听\n     * @param watchField  挂载监听组件存储 字段\n     * @param storeField  操作数据存储 字段\n     * @param path 通知监听器的路径值更新\n     * */\n    _create_CSTU_noticeWatch: (watchField: string, storeField: string, path: CSTU_PathTypes) => void;\n    /**\n     * 基础创建方法=====>更新值\n     * @param componentField 挂载组件存储 字段\n     * @param storeField  操作数据存储 字段\n     * @param watchField  挂载监听组件存储 字段\n     * @param path 更新数据路径\n     * @param value 数据\n     * @param notice 通知更新\n     * @param prototype 是否不改变原始数据存储地址方式直接更新值 (默认false)\n     *\n     * */\n    _create_CSTU_updateValue: <K = any>(componentField: string, storeField: string, watchField: string, path: CSTU_PathTypes, value: K, notice?: boolean | string[], prototype?: boolean) => void;\n    /**\n     * 基础创建方法=====>批量数据更新\n     * @param componentField 挂载组件存储 字段\n     * @param storeField  操作数据存储 字段\n     * @param watchField  挂载监听组件存储 字段\n     * @param values 存储的数据\n     * @param notice 通知更新\n     * @param prototype 是否不改变原始数据存储地址方式直接更新值 (默认false)\n     * */\n    _create_CSTU_bathUpdateValue: (componentField: string, storeField: string, watchField: string, values: Record<string, any>, notice?: boolean | string[], prototype?: boolean) => void;\n    /**\n     * 基础创建方法=====>获取值\n     * @param storeField  操作数据存储 字段\n     * @param path 获取数据的路径\n     * */\n    _create_CSTU_getValue: (storeField: string, path?: CSTU_PathTypes) => any;\n    /**\n     * 基础创建方法=====>设置初始值\n     * @param storeField  操作数据存储 字段\n     * @param initialField  操作数据存储 字段\n     * @param initialValue 初始值存储 字段\n    */\n    _create_CSTU_init: <T = any>(storeField: string, initialField: string, initialValue?: T) => void;\n    /**\n     * 基础创建方法=====> 数据更新,执行选择器(暂时 直接手动调用)\n     * @param selectorMapField  执行器方法集合存储 字段\n     * @param storeField  操作数据存储 字段\n     *\n    */\n    _create_CSTU_bathRunSelector: (selectorMapField: string, storeField: string) => void;\n    /**\n     * 基础创建方法=====>注册 选择器函数，存储状态中提取数据以供此组件\n     * @param selectorMapField  执行器方法集合存储 字段\n     * @param key  map集合 设置值的唯一key值\n     * @param selectorFn  获取最新数据的 执行方法\n     * @param updateData  组件更新方法\n     * @param equalityFn  新老数据对比方法\n    */\n    _create_CSTU_registerSelector: <Selected = unknown, T extends CSTU_Instance = CSTU_Instance>(selectorMapField: string, key: Object | Symbol, selectorFn: (instance: T) => Selected, updateData: (value: Selected) => void, equalityFn?: (a: any, b: any) => boolean) => {\n        data: Selected;\n        unMount: () => void;\n    };\n    /**\n     * 基础创建方法=====>选择器 获取值\n     * @param selectorMapField  执行器方法集合存储 字段\n     * @param storeField  操作数据存储 字段\n     * @param key   从 map集合 取值唯一key值\n     * */\n    _create_CSTU_getSelectorValue: (selectorMapField: string, key: Object | Symbol) => unknown;\n}\n\n```\n\n## 创建`react`使用相关`hooks`方法\n\n```ts\n// hooks/index.ts \n\nimport { CSTU_ClassInterface, CSTU_InstanceProviderProps, Use_CSTU_InstanceItemRegisterProps, CSTU_PathTypes } from "../CSTU_interface";\n\nimport { CSTU_Instance } from "../CSTU_Instance";\n\n/**\n * 创建====Context\n * @param instance 默认初始实例\n *\n * @example\n *\n * const context = create_CSTU_InstanceContext(new CSTU_Instance())\n *\n * */\nexport declare const create_CSTU_InstanceContext: <T extends CSTU_Instance>(instance: T) => import("react").Context<T>;\n/**\n * 创建==== 初始实例化 hooks\n * @param Instance class实例\n *\n * @example\n *\n * const useInitInstance = create_CSTU_Hooks_Instance(CSTU_Instance)\n *\n */\nexport declare function create_CSTU_Hooks_Instance<T extends CSTU_Instance = CSTU_Instance>(InstanceClas: CSTU_ClassInterface<T>): (instance?: T) => T[];\n/**\n * 创建====Provider\n * @param use_CSTU_Instance 获取实例\n * @param Context\n *\n * @example\n *\n * const context = create_CSTU_InstanceContext(new CSTU_Instance())\n *\n * const use_CSTU_Instance = create_CSTU_Hooks_Instance(CSTU_Instance)\n *\n * const Provider = create_CSTU_InstanceProvider(use_CSTU_Instance,context,"方法名")\n *\n*/\nexport declare function create_CSTU_InstanceProvider<T extends CSTU_Instance = CSTU_Instance>(use_CSTU_Instance: (instance?: T) => T[], Context: React.Context<T>): (props: CSTU_InstanceProviderProps<T>) => import("react").FunctionComponentElement<import("react").ProviderProps<T>>;\n/**\n * 创建====获取当前的状态管理实例\n * @param Context\n *\n * @example\n *\n * const context = create_CSTU_InstanceContext(new CSTU_Instance())\n *\n * const use_CSTU_InstanceContext = create_CSTU_hooks_InstanceContext(context)\n *\n * */\nexport declare function create_CSTU_hooks_InstanceContext<T extends CSTU_Instance = CSTU_Instance>(Context: React.Context<T>): () => T;\n/**\n * 创建====子组件注册更新\n * @param Context\n * @param registerFunName 注册方法名称\n *\n * @example\n *\n * const context = create_CSTU_InstanceContext(new CSTU_Instance())\n *\n * const useItemRegister = create_CSTU_hooks_InstanceItemRegister(context,"方法名称")\n *\n *\n*/\nexport declare function create_CSTU_hooks_InstanceItemRegister<T extends CSTU_Instance = CSTU_Instance>(Context: React.Context<T>, registerFunName: string): (props: Use_CSTU_InstanceItemRegisterProps) => T;\n/**\n * 创建====注册监听字段更新\n * @param registerWatchFunName 注册监听器的方法名称\n *\n * @example\n *\n * const use_CSTU_InstanceFieldWatch = create_CSTU_hooks_InstanceFieldWatch("方法名称")\n *\n*/\nexport declare function create_CSTU_hooks_InstanceFieldWatch<T extends CSTU_Instance = CSTU_Instance>(registerWatchFunName: string): (instance: T, path: CSTU_PathTypes, fun?: (value: any) => void) => any;\n/**\n * 创建====执行器\n * @param use_CSTU_Instance 获取实例\n * @param registerSelectorFunName 注册执行器的方法名称\n * @param getSelectorValueFunName 获取最新值的方法名称\n *\n * @example\n *\n * const context = create_CSTU_InstanceContext(new CSTU_Instance())\n *\n * const useInstance = create_CSTU_Hooks_Instance(CSTU_Instance)\n *\n * const use_CSTU_Selector = create_CSTU_hooks_Selector(useInstance,"注册执行器的方法名称","获取最新值的方法名称")\n *\n *\n*/\nexport declare function create_CSTU_hooks_Selector<K extends CSTU_Instance = CSTU_Instance>(use_CSTU_Instance: (instance?: K) => K[], registerSelectorFunName: string, getSelectorValueFunName: string): <Selected = any>(selector: (state: K) => Selected, equalityFn?: (a: any, b: any) => boolean) => Selected;\n/**\n * 更新页面状态\n * */\nexport declare const use_CSTU_Update: () => import("react").MutableRefObject<Function>;\n\n```\n\n## 类型\n\n```ts\n// CSTU_interface.ts \n\nimport type { CSTU_Instance } from "./CSTU_Instance"\n\nexport type CSTU_IntType = string | number | boolean | symbol\n\nexport type CSTU_PathTypes = number | string | (number | string)[]\n\n\n/**实现构造器类型**/\nexport interface CSTU_ClassInterface<T> {\n  new(): T\n}\n\nexport interface CSTU_InstanceProviderProps<K extends CSTU_Instance = CSTU_Instance, T = any> {\n  /**实例*/\n  instance?: K\n  /**内容*/\n  children?: React.ReactNode\n}\n\nexport interface Use_CSTU_InstanceItemRegisterProps {\n  path: CSTU_PathTypes,\n}\n\nexport interface CSTU_RegisterProps {\n  path: CSTU_PathTypes,\n  update: Function\n  /**是否保存*/\n  preserve?: boolean\n}\n\nexport interface CSTU_RegisterWatchProps {\n  path: CSTU_PathTypes,\n  update: (value: any) => void\n}\n\nexport interface CSTU_SelectorListItemType<T extends CSTU_Instance = CSTU_Instance, TState = unknown, Selected = unknown,> {\n  preValue: TState\n  updateData: (value: Selected) => void\n  selector: (instance: T) => Selected,\n  equalityFn?: (a: TState, b: TState) => boolean\n}\n\n```',headings:[],headingsList:[]}}}]);