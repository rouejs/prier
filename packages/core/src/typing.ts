import { PrierHeaders } from "./headers";

// export interface PrierRequest {}

export interface PrierResponse<T = unknown, K = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: PrierHeaders;
  config: PrierConfig<K>;
  request?: any;
}

type reqTokenFunc = (config: PrierConfig) => string;

export interface PrierConfig<T = unknown> {
  baseURL?: string;
  url?: string;
  // 请求方法
  method?: "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "PURGE" | "LINK" | "UNLINK";
  data?: T;
  // 请求头
  headers?: PrierHeaders;
  // 超时
  timeout?: number;
  // 重试次数
  retry?: number;
  // 是否缓存结果
  cache?: boolean;
  // 请求适配器
  adapter?: new () => Adapter;
  // 请求唯一标识Token，插件使用
  reqToken?: string | reqTokenFunc;
}
export abstract class Adapter {
  abstract request<D = unknown, R = unknown>(option: PrierConfig<D>): Promise<PrierResponse<R, D>>;
  abstract abort(): void;
}