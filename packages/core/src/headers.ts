// 该文件简单实现了一个Headers 因为一些环境里不支持Headers，比如小程序

export type HeadersInit = [string, string][] | Record<string, string> | Record<string, string[]> | PrierHeaders;

export class PrierHeaders {
  private headers: Record<string, string[]> = {};

  constructor(headers: HeadersInit = {}) {
    if (headers instanceof PrierHeaders) {
      headers.forEach((key, value) => {
        this.set(key, value);
      });
    } else if (Array.isArray(headers)) {
      for (const [key, value] of headers) {
        this.set(key, value);
      }
    } else {
      Object.keys(headers).forEach((key) => {
        this.set(key, headers[key]);
      });
    }
  }
  /**
   * 给header追加值
   *
   * @param {string} name key名
   * @param {(string | string[])} value 相关内容
   * @memberof PrierHeaders
   */
  append(name: string, value: string | string[]) {
    this.headers[name] = (this.headers[name] || []).concat(value);
  }
  /**
   * 删除对应的key
   *
   * @param {string} name
   * @memberof PrierHeaders
   */
  delete(name: string) {
    delete this.headers[name];
  }
  /**
   * 获取每个key成员
   *
   * @return {*}  {IterableIterator<[string, string]>}
   * @memberof PrierHeaders
   */
  *entries(): IterableIterator<[string, string]> {
    for (const name of Object.keys(this.headers)) {
      yield [name, this.get(name)];
    }
  }
  /**
   * 遍历所有的header信息
   *
   * @template ThisArg
   * @param {(this: ThisArg, value: string, name: string, parent: this) => void} callback
   * @param {ThisArg} [thisArg]
   * @memberof PrierHeaders
   */
  forEach<ThisArg = this>(
    callback: (this: ThisArg, value: string, name: string, parent: this) => void,
    thisArg?: ThisArg
  ) {
    for (const name in this.headers) {
      callback.call(thisArg, this.get(name), name, this);
    }
  }
  /**
   * 获取对应的key
   *
   * @param {string} name key名
   * @return {*}  {string}
   * @memberof PrierHeaders
   */
  get(name: string): string {
    return this.headers[name] ? this.headers[name].join(", ") : null;
  }
  /**
   * 判断是否存在某个key
   *
   * @param {string} name
   * @return {*}  {boolean}
   * @memberof PrierHeaders
   */
  has(name: string): boolean {
    return this.headers.hasOwnProperty(name);
  }
  /**
   * 遍历每个key
   *
   * @return {*}  {IterableIterator<string>}
   * @memberof PrierHeaders
   */
  *keys(): IterableIterator<string> {
    for (const name of Object.keys(this.headers)) {
      yield name;
    }
  }
  /**
   * 设置头信息
   *
   * 和append的主要区别就是这个是直接覆盖之前的内容 append是追加
   *
   * @param {string} name
   * @param {(string | string[])} value
   * @memberof PrierHeaders
   */
  set(name: string, value: string | string[]) {
    this.headers[name] = [].concat(value);
  }
  /**
   * 遍历每个value
   *
   * @return {*}  {IterableIterator<string>}
   * @memberof PrierHeaders
   */
  *values(): IterableIterator<string> {
    for (const name of Object.keys(this.headers)) {
      yield this.get(name);
    }
  }
  // 迭代器支持
  [Symbol.iterator]() {
    return this.entries();
  }
}
