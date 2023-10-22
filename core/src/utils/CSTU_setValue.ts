import { CSTU_getValue } from './CSTU_getValue';
type Path = (string | number | symbol)[];

const internalSet = <Entity = any, Output = Entity, Value = any>(
  input: Entity,
  paths: Path,
  value: Value,
  prototype: boolean = false,
  removeUndefined: boolean,
): Output => {
  if (!paths.length) {
    return value as unknown as Output;
  }

  const [path, ...restPath] = paths;

  let clone: Output;
  // 判断 input 不存在 并且 第一个路径为数值类型
  if (!input && typeof path === 'number') {
    clone = [] as unknown as Output;
  } else if (!input) {
    // input 不存在  默认 对象
    clone = {} as unknown as Output;
  } else if (Array.isArray(input)) {
    // 判断 input 是否是数组
    clone = (prototype ? input : [...input]) as unknown as Output;
  } else {
    // 其他就是 对象
    clone = (prototype ? input : { ...input }) as unknown as Output;
  }

  // 当是否移除undefined===true 时并且 value===undefined 时移除最后一项
  if (removeUndefined && value === undefined && restPath.length === 1) {
    delete clone[path][restPath[0]];
  } else {
    // 递归赋值
    clone[path] = internalSet(clone[path], restPath, value, prototype, removeUndefined);
  }

  return clone;
};

/***设置值*/
export const CSTU_setValue = <Entity = any, Output = Entity, Value = any>(
  input: Entity,
  paths: Path,
  value: Value,
  prototype: boolean = false,
  removeUndefined: boolean = false,
): Output => {
  if (!Array.isArray(paths)) {
    console.warn('paths 参数是数组');
    return input as unknown as Output;
  }

  // 当是否移除undefined===true 时 value 为undefined 并且 input倒数第二个值不存在时直接返回
  if (
    paths.length &&
    removeUndefined &&
    value === undefined &&
    !CSTU_getValue(input, paths.slice(0, -1))
  ) {
    return input as unknown as Output;
  }

  return internalSet(input, paths, value, prototype, removeUndefined);
};

function isObject(obj: any) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
}

function createEmpty<T>(source: T) {
  return (Array.isArray(source) ? [] : {}) as T;
}

const keys = typeof Reflect === 'undefined' ? Object.keys : Reflect.ownKeys;

/**
 * CSTU_merge objects which will create
 */
export function CSTU_merge<T extends object>(...sources: T[]) {
  let clone = createEmpty(sources[0]);

  sources.forEach(src => {
    function internalCSTU_merge(path: Path, parentLoopSet?: Set<object>) {
      const loopSet = new Set(parentLoopSet);

      const value = CSTU_getValue(src, path);

      const isArr = Array.isArray(value);

      if (isArr || isObject(value)) {
        // Only add not loop obj
        if (!loopSet.has(value)) {
          loopSet.add(value);

          const originValue = CSTU_getValue(clone, path);

          if (isArr) {
            // Array will always be override
            clone = CSTU_setValue(clone, path, []);
          } else if (!originValue || typeof originValue !== 'object') {
            // Init container if not exist
            clone = CSTU_setValue(clone, path, createEmpty(value));
          }

          keys(value).forEach(key => {
            internalCSTU_merge([...path, key], loopSet);
          });
        }
      } else {
        clone = CSTU_setValue(clone, path, value);
      }
    }

    internalCSTU_merge([]);
  });

  return clone;
}

