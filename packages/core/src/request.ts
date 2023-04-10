import EventEmitter from "./eventEmitter";
import { PrierHeaders, HeadersInit } from "./headers";
import { PrierPluginResult, TPluginReturn } from "./plugin";
import { PrierResponse } from "./response";
import { PrierConfig } from "./typing";
/**
 * 请求对象
 * 每一个请求对象都会有一个对应的response
 * @export
 * @class PrierRequest
 * @extends {EventEmitter}
 * @template D
 * @template R
 */
export class PrierRequest<D = unknown, R = unknown> extends EventEmitter {
  /**
   * 请求的配置信息
   *
   * @private
   * @type {PrierConfig<D>}
   * @memberof PrierRequest
   */
  private config: PrierConfig<D>;
  /**
   * 请求头信息
   *
   * @private
   * @type {PrierHeaders}
   * @memberof PrierRequest
   */
  private headers: PrierHeaders;
  /**
   * 请求相关的中间件[插件]
   *
   * @private
   * @type {PrierPluginResult<D, R>[]}
   * @memberof PrierRequest
   */
  private plugins: PrierPluginResult<D, R>[] = [];

  private pluginIndex: number = 0;

  /**
   * 对应的Reponse对象
   *
   * @type {PrierResponse<R, D>}
   * @memberof PrierRequest
   */
  public response: PrierResponse<R, D>;
  /**
   * Creates an instance of PrierRequest.
   * @param {PrierConfig<D>} config 请求的配置信息
   * @param {PrierPluginResult<D, R>[]} [plugin=[]] 需要执行的中间件[插件]
   * @memberof PrierRequest
   */
  constructor(config: PrierConfig<D>, plugin: PrierPluginResult<D, R>[] = []) {
    super();
    // 处理默认参数
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
   * 该Token在请求过程中起到非常重要的作用，对于区分请求的意义重大
   * @return {*}  {string}
   * @memberof PrierRequest
   */

  getToken(): string {
    const { reqToken } = this.config;
    // 用户指定了reqToken的情况下，用用户指定的
    if (typeof reqToken === "string") {
      return reqToken;
    }
    let token = "";
    if (typeof reqToken === "function") {
      // 让用户根据自己的实际情况去生成相应的token
      token = reqToken(this.config);
    } else {
      // 生成随机token
      token = `req_${Math.random().toString(36).slice(2)}`;
    }
    this.config.reqToken = token;
    return token;
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
   * 执行下一个plugin
   *
   * @param {number} [target] 可以指定执行到第几个插件 默认是按照顺序往下执行
   * @return {*}  {Promise<TPluginReturn<D, R>>}
   * @memberof PrierRequest
   */
  async next(target?: number): Promise<TPluginReturn<D, R>> {
    if (typeof target === "number") {
      this.pluginIndex = target;
    }
    const { response, plugins } = this;
    let plugin = plugins[this.pluginIndex++];
    // 所有的插件都执行完毕，直接返回当前的请求对象
    if (!plugin) {
      return this;
    }
    // 执行下一个插件逻辑
    return await plugin(this, response, this.pluginIndex);
  }
}
