export class ValuesCache {

  readonly values: {[key: string]: any} = {}

  get<T>(key: string, getter: () => T): T {
    let value = this.values[key] as T
    if (value == undefined) {
      value = getter()
      this.values[key] = value
    }
    return value
  }
}
