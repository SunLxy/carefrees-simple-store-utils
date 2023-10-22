
type Path = (string | number | symbol)[];

/**获取值*/
export const CSTU_getValue = (input: any, path: Path) => {
  let output = input;
  for (let i = 0; i < path.length; i += 1) {
    if (output === null || output === undefined) {
      return undefined;
    }
    output = output[path[i]];
  }
  return output;
};
