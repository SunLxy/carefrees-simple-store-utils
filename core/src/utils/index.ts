
import { PathTypes } from "../CSTU_interface"

export * from "./CSTU_getValue"
export * from "./CSTU_setValue"
export * from "./CSTU_isEqual"

/**格式化路径*/
export const getFormatPath = (path: PathTypes) => {
  if (Array.isArray(path)) {
    return path.join("_")
  }
  return `${path}`
}

/**路径转换数组*/
export const toArray = (path: PathTypes) => {
  if (Array.isArray(path)) {
    return path
  }
  return [path]
}

/**路径字符串转换成数组*/
export const splitPath = (path: string) => {
  return path.split("_").filter(Boolean)
}