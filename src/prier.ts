import type Adapter from "./adapter";
import Request from "./request";
import type Headers from "./headers";
import type Response from "./response";

interface Config<T = unknown> {
  baseURL?: string;
  url?: string;
  // 请求方法
  method?: Prier.TMethod;
  data?: T;
  // 请求头
  headers?: Headers;
  // 超时
  timeout?: number;
  // 重试次数
  retry?: number;
  // 是否缓存结果
  cache?: boolean;
  // 防抖操作，以防用户的连续点击
  debounce?: number;

  adapter?: Adapter;
}

export default class Prier {
  adapter: Adapter;

  constructor(protected config: Config) {
    let adapter: Adapter = null;
    if (!this.config.adapter) {
      // TODO 获取默认的adapter
    }
    this.adapter = adapter;
  }

  // 注册适配器
  use<T extends Adapter>(adapter: T) {
    this.adapter = adapter;
  }

  request(config: string | Config): Promise<Response>;
  request(url: string | Config, config: Config = {}): Promise<Response> {
    if (typeof url === "string") {
      config = {
        ...config,
        url,
      };
    }

    const { headers, method, data } = config;

    const req = new Request(config.url, {
      headers,
      method,
      body: data,
    });
    return this.adapter.request(req);
  }

  abort() {}
}
