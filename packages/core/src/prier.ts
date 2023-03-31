import EventEmitter from "./eventEmitter";
import type { PrierPlugin, PrierPluginResult } from "./plugin";
import type { PrierConfig } from "./typing";
import { PrierHeaders } from "./headers";
import { PrierRequest } from "./request";
import { PrierResponse } from "./response";

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

  use<T = unknown>(plugin: PrierPlugin<T>, config: T extends undefined ? undefined : T = undefined): void {
    const ret = plugin.install(this, config);
    if (typeof ret === "function") {
      this.pluginLists.push(ret);
    }
  }

  /**
   * 发送请求
   *
   * @template D
   * @template R
   * @param {PrierConfig<D>} config
   * @return {*}  {Promise<PrierResponse<R, D>>}
   * @memberof Prier
   */
  async request<D = unknown, R = unknown>(config: PrierConfig<D>): Promise<PrierResponse<R, D>> {
    let realConf = this.getConfig(config);
    // 创建请求对象
    let request = new PrierRequest(realConf, this.pluginLists);
    return request.next().then((ret) => {
      if (ret instanceof PrierResponse) {
        // 如果返回的是一个响应对象 说明是要中断服务了，一般在处理Mock或者是缓存之类需要使用
        return ret as PrierResponse<R, D>;
      } else if (ret instanceof Error) {
        // 错误直接排除异常，交由业务层处理
        throw ret;
      }
      // 调用对应的请求适配器发送请求
      const adapter = new this.adapter();
      return adapter.request(request);
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
