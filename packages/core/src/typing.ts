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
  // 判断相应是否有效 针对部分业务错误码仅根据接口特定字段判断请求状态
  // 如某些借口返回的数据格式为{code:200 ,data:{},msg:""}，其中code为业务错误码，data为业务数据，msg为业务错误信息
  // 上面这种情况可配置validate: (rsp: PrierResponse) => rsp.data.code === 200
  validate?: (rsp: PrierResponse) => boolean;
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
