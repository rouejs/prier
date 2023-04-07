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
  /**
   * 发送请求
   *
   * @abstract
   * @template D
   * @template R
   * @param {PrierRequest<D, R>} req 请求对象
   * @param {PrierResponse<R, D>} res 响应对象
   * @return {*}  {Promise<PrierResponse<R, D>>}
   * @memberof Adapter
   */
  abstract request<D = unknown, R = unknown>(
    // 请求对象
    req: PrierRequest<D, R>,
    // 响应对象
    res: PrierResponse<R, D>
  ): Promise<PrierResponse<R, D>>;
  /**
   * 中断请求
   *
   * @abstract
   * @memberof Adapter
   */
  abstract abort(): void;
}
