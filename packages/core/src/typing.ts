import type { PrierHeaders } from "./headers";
import type { PrierRequest } from "./request";
import type { PrierResponse } from "./response";

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
  // 请求适配器
  adapter?: new () => Adapter;
  // 请求唯一标识Token，插件使用
  reqToken?: string | reqTokenFunc;
}
export abstract class Adapter {
  abstract request<D = unknown, R = unknown>(
    req: PrierRequest<D>,
    res: PrierResponse<R, D>
  ): Promise<PrierResponse<R, D>>;
  abstract abort(): void;
}
