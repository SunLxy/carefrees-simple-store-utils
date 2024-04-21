import { CSTU_PathTypes, CSTU_RegisterProps, CSTU_RegisterWatchProps, ListenerType } from "./CSTU_interface"
import { CSTU_getFormatPath, CSTU_toArray, CSTU_getValue, CSTU_setValue, CSTU_splitPath, CSTU_merge } from "./utils"

export class CSTU_Instance {

  // storeField: string, // 操作数据存储 字段
  // initialField:string, // 初始值存储 字段
  // componentField: string, // 挂载组件存储 字段
  // watchField: string // 挂载监听组件存储 字段
  // selectorMapField:string // 执行器方法集合存储 字段

  /**
   * 基础创建方法=====>获取数组数据
   * @param field 字段
   * */
  _get_CSTU_list = <K>(field: string): K[] => {
    this[field] = this[field] || []
    return this[field]
  }

  /**
   * 基础创建方法=====>获取对象数据
   * @param field 字段
  */
  _get_CSTU_store = <R = any>(field: string): R => {
    this[field] = this[field] || {}
    return this[field]
  }

  /**
 * 基础创建方法=====>获取 Set 对象数据
 * @param field 字段
 * */
  _get_CSTU_set = <T>(field: string): Set<T> => {
    this[field] = this[field] || new Set([])
    return this[field]
  }


  /**
   * 基础创建方法=====>注册组件
   * @param componentField 挂载组件存储 字段 
   * @param storeField  操作数据存储 字段
   * @param initialField  初始值存储 字段
   * @param props 内部操作参数
   * @param prototype 是否在不改变原始数据存储地址方式直接更新值 (默认false)
   * 
   * */
  _create_CSTU_register = <R = any>(
    componentField: string,
    storeField: string | undefined | null,
    initialField: string | undefined | null,
    props: CSTU_RegisterProps,
    prototype: boolean = false
  ) => {
    this._get_CSTU_list<CSTU_RegisterProps>(componentField).push(props)
    return () => {
      this[componentField] = this._get_CSTU_list<CSTU_RegisterProps>(componentField).filter((ite) => ite !== props)
      const { preserve = true } = props
      const currentPath = CSTU_getFormatPath(props.path)
      /**查询是否存在相同字段的组件*/
      const finx = this._get_CSTU_list<CSTU_RegisterProps>(componentField).find((item) => CSTU_getFormatPath(item.path) === currentPath)
      /**当不存储 并且 没有相同字段组件的时候*/
      if (!preserve && !finx && storeField && initialField) {
        /**
        * 1. 通过参数控制卸载组件是否进行初始化参数
        * 2. 判断当前组件是否已经不存在，不存在则进行初始化
        * 3. 当前值和默认值相等的时候
        * */
        const pathArr = CSTU_toArray(props.path)
        const defaultValue = CSTU_getValue(this._get_CSTU_store<R>(initialField), pathArr)
        const value = CSTU_getValue(this._get_CSTU_store<R>(storeField), pathArr)
        if (defaultValue !== value) {
          this[storeField] = CSTU_setValue(this._get_CSTU_store<R>(storeField), pathArr, defaultValue, prototype)
        }
      }
    }
  }

  /**
   * 基础创建方法=====>注册监听字段
   * @param watchField  挂载监听组件存储 字段
   * @param props 内部操作参数
   * */
  _create_CSTU_registerWatch = (
    watchField: string,
    props: CSTU_RegisterWatchProps
  ) => {
    this._get_CSTU_list<CSTU_RegisterWatchProps>(watchField).push(props)
    return () => {
      this[watchField] = this._get_CSTU_list<CSTU_RegisterWatchProps>(watchField).filter((ite) => ite !== props)
    }
  }

  /**
   * 基础创建方法=====>通知组件更新
   * @param componentField 挂载组件存储 字段
   * @param path 更新组件路径
   * */
  _create_CSTU_notice = (
    componentField: string,
    path: CSTU_PathTypes
  ) => {
    const newPath = CSTU_getFormatPath(path)
    const componentList = this._get_CSTU_list<CSTU_RegisterProps>(componentField).filter((item) => CSTU_getFormatPath(item.path) === newPath)
    componentList.forEach((com) => {
      /**通知更新组件*/
      if (com && typeof com.update === "function") {
        com.update()
      }
    })
  }

  /**
   * 基础创建方法=====>批量更新组件， 当不传递值的时候，更新所有组件
   * @param componentField 挂载组件存储 字段
   * @param paths 更新组件路径集合
   * 
  */
  _create_CSTU_bathNotice = (
    componentField: string,
    paths: string[] | boolean = true
  ) => {
    if (Array.isArray(paths)) {
      paths.forEach((path) => {
        if (path) {
          this._create_CSTU_notice(componentField, CSTU_splitPath(path))
        }
      })
    } else if (typeof paths === "boolean" && paths) {
      // 更新所有组件
      this._get_CSTU_list<CSTU_RegisterProps>(componentField).forEach((component) => {
        /**通知更新组件*/
        if (component && typeof component.update === "function") {
          component.update()
        }
      })
    }
  }

  /**
   * 基础创建方法=====>通知监听
   * @param watchField  挂载监听组件存储 字段
   * @param storeField  操作数据存储 字段
   * @param path 通知监听器的路径值更新
   * */
  _create_CSTU_noticeWatch = (
    watchField: string,
    storeField: string,
    path: CSTU_PathTypes
  ) => {
    const watchPath = CSTU_getFormatPath(path)
    const value = CSTU_getValue(this._get_CSTU_store(storeField), CSTU_toArray(path))
    this._get_CSTU_list<CSTU_RegisterWatchProps>(watchField).forEach((item) => {
      if (CSTU_getFormatPath(item.path) === watchPath) {
        item.update(value)
      }
    })
  }

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
  _create_CSTU_updateValue = <K = any>(
    componentField: string,
    storeField: string,
    watchField: string | undefined | null,
    path: CSTU_PathTypes,
    value: K,
    notice: boolean | string[] = true,
    prototype: boolean = false
  ) => {
    const preVaue = CSTU_getValue(this._get_CSTU_store(storeField), CSTU_toArray(path));
    this[storeField] = CSTU_setValue(this._get_CSTU_store(storeField), CSTU_toArray(path), value, prototype);
    /**判断值相等 , 当相等的时候才进行更新监听的值*/
    if (preVaue !== value && watchField)
      this._create_CSTU_noticeWatch(watchField, storeField, path);

    if (typeof notice === "boolean" && notice) {
      this._create_CSTU_notice(componentField, path)
    } else if (Array.isArray(notice)) {
      this._create_CSTU_bathNotice(componentField, notice)
    }
  }

  /**
   * 基础创建方法=====>批量数据更新
   * @param componentField 挂载组件存储 字段
   * @param storeField  操作数据存储 字段
   * @param watchField  挂载监听组件存储 字段
   * @param values 存储的数据
   * @param notice 通知更新
   * @param prototype 是否不改变原始数据存储地址方式直接更新值 (默认false)
   * */
  _create_CSTU_bathUpdateValue = (
    componentField: string,
    storeField: string,
    watchField: string | undefined | null,
    values: Record<string, any>,
    notice: boolean | string[] = true,
    prototype: boolean = false
  ) => {
    if (values) {
      Object.entries(values).forEach(([path, value]) => {
        const preVaue = CSTU_getValue(this._get_CSTU_store(storeField), CSTU_toArray(path));
        this[storeField] = CSTU_setValue(this._get_CSTU_store(storeField), CSTU_splitPath(path), value, prototype)
        /**判断值相等 , 当相等的时候才进行更新监听的值*/
        if (preVaue !== value && watchField)
          this._create_CSTU_noticeWatch(path, watchField, storeField);
      })
      if (typeof notice === "boolean" && notice) {
        this._create_CSTU_bathNotice(componentField, Object.keys(values),)
      } else if (Array.isArray(notice)) {
        this._create_CSTU_bathNotice(componentField, notice)
      }
    }
  }

  /**
   * 基础创建方法=====>获取值
   * @param storeField  操作数据存储 字段
   * @param path 获取数据的路径
   * */
  _create_CSTU_getValue = (
    storeField: string,
    path?: CSTU_PathTypes
  ) => {
    if (path) {
      return CSTU_getValue(this._get_CSTU_store(storeField), CSTU_toArray(path))
    }
    return this._get_CSTU_store(storeField)
  }

  /**
   * 基础创建方法=====>设置初始值
   * @param storeField  操作数据存储 字段
   * @param initialField  操作数据存储 字段
   * @param initialValue 初始值存储 字段
   * @param prototype 是否不改变原始数据存储地址方式存储 (默认false)
   * 
  */
  _create_CSTU_init = <T = any>(
    storeField: string,
    initialField: string | undefined | null,
    initialValue?: T,
    prototype: boolean = false
  ) => {
    if (prototype) {
      this[storeField] = (initialValue || {}) as T
      if (initialField) {
        this[initialField] = CSTU_merge({}, this._get_CSTU_store(storeField))
      }
    } else {
      if (initialField) {
        this[initialField] = (initialValue || {}) as T
      }
      this[storeField] = CSTU_merge(initialField ? this._get_CSTU_store(initialField) : initialValue, this._get_CSTU_store(storeField))
    }
  }

  //-------------------------- Selector 选择器部分--------------------------------------
  /**获取状态*/
  _create_CSTU_getState = <T extends CSTU_Instance = CSTU_Instance>(): { instance: T } => ({ instance: this }) as unknown as { instance: T };
  /**获取初始值*/
  _create_CSTU_getInitialState = <T extends CSTU_Instance = CSTU_Instance>(): { instance: T } => ({ instance: this }) as unknown as { instance: T };
  /**
   * 监听注册监听方法
   * @param setField 方法集合存储 字段
   * @param listener 注册执行方法
   * 
  */
  _crate_CSTU_registerSubscribe = <T extends CSTU_Instance = CSTU_Instance>(setField: string,) => {
    return (listener: ListenerType<T>) => {
      this._get_CSTU_set(setField).add(listener)
      return () => this._get_CSTU_set(setField).delete(listener);
    }
  }
  /**
   * 销毁注册监听方法数据
   * @param setField 方法集合存储 字段
   * @param listener 注册执行方法
   * 
  */
  _crate_CSTU_destroySubscribe = (setField: string) => {
    return () => this._get_CSTU_set(setField).clear()
  }

  /**
   * 销毁注册监听方法数据
   * @param setField 方法集合存储 字段
   * @param listener 注册执行方法
   * 
  */
  _crate_CSTU_RunSubscribe = (setField: string) => {
    // this._get_CSTU_set(setField).forEach((listener) => listener(this))
  }
}
