import { Adapter } from "./adapter";
import MCAdapter from "./mc";
import type { GetStoreItemStruct, SetStoreItemStruct, StoreConfig } from "./typing";

export class Store {
  /**
   * 基础配置
   *
   * @type {StoreConfig}
   * @memberof Store
   */
  baseConfig: StoreConfig;
  /**
   * 缓存适配器
   *
   * @type {Adapter}
   * @memberof Store
   */
  adapter: Adapter;
  constructor(config: Partial<StoreConfig>) {
    this.baseConfig = {
      namespace: "prier",
      ttl: 60 * 1000,
      max: 1000,
      ...config,
    };
    this.adapter = this.baseConfig.adapter || new MCAdapter(this.baseConfig);
  }
  /**
   * 通过缓存key获取缓存
   *
   * @template T
   * @param {string} key 缓存key
   * @return {*}  {T}
   * @memberof Store
   */
  get<T>(key: string): T;
  /**
   * 获取缓存key和其他配置项获取缓存
   *
   * @template T
   * @param {string} key 缓存key
   * @param {GetStoreItemStruct<T>} option 缓存完整配置
   * @return {*}  {T}
   * @memberof Store
   */
  get<T>(key: string, option: GetStoreItemStruct<T>): T;
  /**
   * 通过缓存配置项获取缓存
   *
   * @template T
   * @param {GetStoreItemStruct<T>} option 缓存配置项
   * @return {*}  {T}
   * @memberof Store
   */
  get<T>(option: GetStoreItemStruct<T>): T;
  /**
   * 读取缓存
   *
   * @template T
   * @param {(string | GetStoreItemStruct<T>)} keyOrOption 缓存key或者缓存配置项
   * @param {GetStoreItemStruct<T>} [option] 缓存配置项
   * @return {*}  {T}
   * @memberof Store
   */
  get<T>(keyOrOption: string | GetStoreItemStruct<T>, option?: GetStoreItemStruct<T>): T {
    let finalOption: GetStoreItemStruct<T>;
    if (typeof keyOrOption === "string") {
      finalOption = { ...option, key: keyOrOption };
    } else {
      finalOption = { ...keyOrOption, ...option };
    }
    if (!finalOption.key) {
      throw new Error("key is required");
    }
    return this.adapter.get<T>(finalOption);
  }
  /**
   * 通过key和value设置缓存
   *
   * @template T
   * @param {string} key 缓存key
   * @param {T} value 缓存value
   * @return {*}  {T}
   * @memberof Store
   */
  set<T>(key: string, value: T): T;
  /**
   * 通过key和value和ttl设置缓存
   *
   * @template T
   * @param {string} key 缓存key
   * @param {T} value 缓存value
   * @param {number} ttl 缓存过期时间
   * @return {*}  {T}
   * @memberof Store
   */
  set<T>(key: string, value: T, ttl: number): T;
  /**
   * 通过key和value和option设置缓存
   *
   * @template T
   * @param {string} key 缓存key
   * @param {T} value 缓存value
   * @param {SetStoreItemStruct<T>} option 缓存配置项
   * @return {*}  {T}
   * @memberof Store
   */
  set<T>(key: string, value: T, option: SetStoreItemStruct<T>): T;
  /**
   * 通过配置项设置缓存
   *
   * @template T
   * @param {SetStoreItemStruct<T>} option 缓存配置项
   * @return {*}  {T}
   * @memberof Store
   */
  set<T>(option: SetStoreItemStruct<T>): T;
  /**
   * 设置缓存
   *
   * @template T
   * @param {(string | SetStoreItemStruct<T>)} keyOrOption 缓存key或者缓存配置项
   * @param {T} [value] 缓存value
   * @param {(number | SetStoreItemStruct<T>)} [ttlOrOption] 缓存过期时间或者缓存配置项
   * @return {*}  {T}
   * @memberof Store
   */
  set<T>(keyOrOption: string | SetStoreItemStruct<T>, value?: T, ttlOrOption?: number | SetStoreItemStruct<T>): T {
    let finalOption: SetStoreItemStruct<T>;
    if (typeof keyOrOption === "string") {
      finalOption = { key: keyOrOption, value };
    } else {
      finalOption = { ...keyOrOption };
    }
    if (typeof ttlOrOption === "number") {
      finalOption = { ...finalOption, ttl: ttlOrOption };
    }
    if (!finalOption.key) {
      throw new Error("key is required");
    }
    return this.adapter.set<T>(finalOption);
  }
}
