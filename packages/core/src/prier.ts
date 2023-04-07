import EventEmitter from "./eventEmitter";
import type { PrierPlugin, PrierPluginResult } from "./plugin";
import type { PrierConfig } from "./typing";
import { PrierHeaders } from "./headers";
import { PrierRequest } from "./request";
import { PrierResponse } from "./response";
/**
 * Prier 请求核心
 *
 * @export
 * @class Prier
 * @extends {EventEmitter}
 * @example
 * var prier = new Prier({baseURL: "http://localhost"});
 * 注册中间件
 * prier.use(yourCustomPlugin, {...插件配置})
 * 发送请求
 * await prier.request({url:"api/path"})
 */
export class Prier extends EventEmitter {
  private baseConfig;
  private adapter;

  private pluginLists: PrierPluginResult[] = [];

  constructor(config?: Omit<PrierConfig, "data">) {
    super();
    const { adapter, ...others } = config;
    this.baseConfig = { ...others };
    this.baseConfig.headers = new PrierHeaders(config.headers);
    this.adapter = adapter;
  }
  /**
   * 使用Plugin
   *
   * @template T
   * @param {PrierPlugin<T>} plugin 需要安装的插件
   * @param {T extends undefined ? undefined : T} [config=undefined] 插件相关配置信息
   * @return {*}  {this}
   * @memberof Prier
   * @example
   * prier.use(debounce, {
   *  debounce: 1000
   * })
   */
  use<T = unknown>(plugin: PrierPlugin<T>, config: T extends undefined ? undefined : T = undefined): this {
    const ret = plugin.install(this, config);
    if (typeof ret === "function") {
      this.pluginLists.push(ret);
    }
    return this;
  }

  /**
   * 发送请求
   *
   * @template D
   * @template R
   * @param {PrierConfig<D>} config 请求的配置信息
   * @return {*}  {Promise<PrierResponse<R, D>>}
   * @memberof Prier
   * @example
   * prier.request({
   *  url: 'http://localhost'
   * }).then(console.log)
   *
   * prier.request({})
   */
  async request<D = unknown, R = unknown>(config: PrierConfig<D>): Promise<PrierResponse<R, D>> {
    let realConf = this.getConfig(config);

    const plugins = [
      ...(this.pluginLists as PrierPluginResult<D, R>[]),
      () => {
        // 将发送请求也包装进插件任务中
        const adapter = new this.adapter();
        return adapter.request(request, request.response);
      },
    ];

    // 创建请求对象
    let request: PrierRequest<D, R> = new PrierRequest<D, R>(realConf, plugins);
    request.emit("request", request);

    return request.next().then((ret) => {
      ret = ret || request;
      request.emit("complete", ret);
      if (ret instanceof PrierResponse) {
        //需要直接响应出去的数据
        request.emit("success", ret);
        return ret as PrierResponse<R, D>;
      }
      if (ret instanceof Error) {
        request.emit("error", ret);
        // 错误直接抛出异常，交由业务层处理
        throw ret;
      }
      request.emit("success", ret.response);
      return ret.response;
    });
  }
  /**
   * 获取完整的配置信息
   *
   * @private
   * @template D
   * @param {PrierConfig<D>} config 提供的配置项
   * @return {*}  {PrierConfig<D>}
   * @memberof Prier
   */
  private getConfig<D = unknown>(config: PrierConfig<D>): PrierConfig<D> {
    const { headers, ...others } = config;
    const realConfig: PrierConfig<D> = { method: "GET", ...this.baseConfig, ...others };
    if (headers) {
      const baseHeaders = new PrierHeaders(this.baseConfig.headers);
      const header = new PrierHeaders(headers);
      for (const [key, value] of header) {
        baseHeaders.set(key, value);
      }
      realConfig.headers = baseHeaders;
    }
    return realConfig;
  }
}
