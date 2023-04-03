import EventEmitter from "./eventEmitter";
import { PrierHeaders, HeadersInit } from "./headers";
import { PrierPluginResult, TPluginReturn } from "./plugin";
import { PrierResponse } from "./response";
import { PrierConfig } from "./typing";

export class PrierRequest<D = unknown, R = unknown> extends EventEmitter {
  private config: PrierConfig<D>;
  private headers: PrierHeaders;
  private plugins: PrierPluginResult[] = [];
  public response: PrierResponse<R, D>;
  constructor(config: PrierConfig<D>, plugin: PrierPluginResult[] = []) {
    super();
    this.config = {
      method: "GET",
      headers: new PrierHeaders(),
      ...config,
    };
    this.headers = this.config.headers;
    this.plugins = [...plugin];
    this.response = new PrierResponse({ request: this });
  }
  /**
   * 获取请求的token
   *
   * @return {*}  {string}
   * @memberof PrierRequest
   */

  getToken(): string {
    const { reqToken } = this.config;
    if (typeof reqToken === "string") {
      return reqToken;
    } else if (typeof reqToken === "function") {
      return reqToken(this.config);
    }
    return `req_${Math.random().toString(36).slice(2)}`;
  }
  /**
   * 获取请求配置
   *
   * @return {*}
   * @memberof PrierRequest
   */
  getConfig(): PrierConfig<D> {
    return {
      ...this.config,
      headers: this.headers,
    };
  }
  /**
   * 设置配置信息
   *
   * @param {PrierConfig<D>} config
   * @memberof PrierRequest
   */
  setConfig(config: PrierConfig<D>) {
    this.config = {
      ...this.config,
      ...config,
    };
  }
  /**
   * 设置请求头
   *
   * @param {HeadersInit} headers 头信息
   * @memberof PrierRequest
   */
  setHeaders(headers: HeadersInit) {
    const header = new PrierHeaders(headers);
    header.forEach((value, key) => {
      this.headers.set(key, value);
    });
  }
  /**
   * 执行下一个Plugin
   *
   * @return {*}  {Promise<TPluginReturn>}
   * @memberof PrierRequest
   */
  async next(): Promise<TPluginReturn> {
    const { response, plugins } = this;
    let plugin = plugins.shift();
    // 所有的插件都执行完毕，直接返回当前的请求对象
    if (!plugin) {
      return this;
    }
    // 执行下一个插件逻辑
    return await plugin(this, response);
  }
}
