
import { CSTU_PathTypes } from "../CSTU_interface"

export * from "./CSTU_getValue"
export * from "./CSTU_setValue"
export * from "./CSTU_isEqual"

/**格式化路径*/
export const CSTU_getFormatPath = (path: CSTU_PathTypes) => {
  if (Array.isArray(path)) {
    return path.join("_")
  } else if (["number", "boolean"].includes(typeof path)) {
    return path
  } else if (!path) {
    return ''
  }
  return `${path}`
}

/**路径转换数组*/
export const CSTU_toArray = (path: CSTU_PathTypes) => {
  if (Array.isArray(path)) {
    return path
  } else if (["number", "boolean"].includes(typeof path)) {
    return [path]
  } else if (typeof path === "string") {
    return CSTU_splitPath(`${path}`)
  }
  return []
}

/**路径字符串转换成数组*/
export const CSTU_splitPath = (path: string) => {
  if (typeof path === "string") {
    return path.split("_").filter(Boolean)
  } else if (["number", "boolean"].includes(typeof path)) {
    return [path]
  }
  return []
}