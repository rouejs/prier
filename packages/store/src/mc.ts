import { Adapter } from "./adapter";
import { GetStoreItemStruct, SetStoreItemStruct, StoreConfig } from "./typing";

interface StoreItem {
  value: unknown;
  expireAt: number;
}
const checkTime = 1000;
export default class MCAdapter implements Adapter {
  private store = new Map<string, StoreItem>();
  constructor(private config: StoreConfig) {
    // 启用定时器，定时检查过期缓存
    setInterval(() => {
      this.expireCheck();
    }, checkTime);
  }
  /**
   * 设置缓存
   *
   * @template T
   * @param {SetStoreItemStruct<T>} option
   * @return {*}  {T}
   * @memberof MCAdapter
   */
  set<T = unknown>(option: SetStoreItemStruct<T>): T {
    const { namespace = this.config.namespace, key, value, ttl = this.config.ttl } = option;
    const storeKey = `${namespace}:${key}`;
    this.store.set(storeKey, {
      value,
      expireAt: ttl ? Date.now() + ttl : 0,
    });
    return value;
  }
  /**
   * 读取缓存
   *
   * @template T
   * @param {GetStoreItemStruct<T>} option
   * @return {*}  {T}
   * @memberof MCAdapter
   */
  get<T = unknown>(option: GetStoreItemStruct<T>): T {
    const { namespace = this.config.namespace, key, defaultValue } = option;
    const storeKey = `${namespace}:${key}`;
    const item = this.store.get(storeKey);
    if (item.expireAt < Date.now()) {
      // 缓存过期
      this.store.delete(storeKey);
      return defaultValue;
    }
    return (item.value as T) ?? defaultValue;
  }
  /**
   * 清除缓存
   *
   * @param {string} [namespace] 指定需要清除的命名空间
   * @memberof MCAdapter
   */
  clear(namespace?: string) {
    if (namespace) {
      const prefix = `${namespace}:`;
      for (const [key, _] of this.store) {
        if (key.startsWith(prefix)) {
          this.store.delete(key);
        }
      }
    } else {
      this.store.clear();
    }
  }
  /**
   * 刷新缓存过期时间
   *
   * @param {string} namespace 命名空间
   * @param {string} key 缓存key
   * @param {number} [ttl=5 * 60 * 1000] 过期时间，单位毫秒
   * @memberof MCAdapter
   */
  refresh(namespace: string, key: string, ttl: number = 5 * 60 * 1000) {
    const storeKey = `${namespace}:${key}`;
    const item = this.store.get(storeKey);
    if (item) {
      item.expireAt = Date.now() + ttl;
      this.store.set(storeKey, item);
    }
  }
  /**
   * 检查过期缓存
   *
   * @memberof MCAdapter
   */
  expireCheck() {
    const now = Date.now();
    for (const [key, item] of this.store) {
      if (item.expireAt !== 0 && item.expireAt < now) {
        // 缓存过期
        this.store.delete(key);
      }
    }
  }
}
