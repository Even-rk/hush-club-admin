/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
export const useDeepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (obj instanceof Array) {
    return obj.map(item => useDeepClone(item)) as unknown as T
  }

  if (obj instanceof Object) {
    const copy = {} as Record<string, T>
    Object.keys(obj).forEach(key => {
      copy[key] = useDeepClone((obj as Record<string, T>)[key])
    })
    return copy as unknown as T
  }

  return obj
}
