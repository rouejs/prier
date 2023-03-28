import EventEmitter from "./eventEmitter";
import { PrierHeaders } from "./headers";
import type { PrierPlugin, PrierPluginInstall } from "./plugin";
import { PrierRequest } from "./request";
import type { PrierResponse, PrierConfig } from "./typing";

export class Prier extends EventEmitter {
  private baseConfig;
  private adapter;

  private pluginLists: PrierPluginInstall[] = [];

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

    let request = new PrierRequest(realConf, this.pluginLists);

    // 生成请求的Token 用来标识不同的请求，如果Token一致的情况下，则代表接口的作用是一样的
    // 部分插件依赖这个reqToken来进行缓存或者其他的操作
    realConf.reqToken = this.getReqToken(realConf);
    for await (const val of this.execPlugin<D>(realConf)) {
      // str = str + val;
    }
    const adapter = new this.adapter();
    return adapter.request(realConf);
  }
  /**
   * 获取请求Token
   *
   * @param {PrierConfig} config
   * @return {*}  {string}
   * @memberof Prier
   */
  getReqToken(config: PrierConfig): string {
    if (typeof config.reqToken === "string") {
      return config.reqToken;
    } else if (typeof config.reqToken === "function") {
      return config.reqToken(config);
    }
    return `req_${Math.random().toString(36).slice(2)}`;
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

  async *execPlugin<T = unknown>(realConf: PrierConfig<T>) {
    let i = 0;
    while (i < this.pluginLists.length) {
      const plugin = this.pluginLists[i];
      yield await plugin(realConf);
      i++;
    }
    return realConf;
  }
}
