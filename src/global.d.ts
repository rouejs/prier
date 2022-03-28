declare namespace Prier {
  // 请求方式
  export type Method = "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "HEAD" | "OPTIONS" | "PURGE" | "LINK" | "UNLINK";
  export type Headers = Record<string, string | number | boolean>;

  export interface DefaultConfig
    extends Pick<RequestConfig, "method" | "headers" | "timeout" | "url" | "debounce" | "cache" | "validate"> {}

  // 请求参数
  export interface RequestConfig<Q = unknown> {
    url: string;
    baseURL?: string;
    method: Method;
    headers: Headers;
    data: Q;
    adapter: AdapterConstruct<Q>;
    timeout: number;
    debounce: number;
    cache: boolean;
    validate: <S = unknown>(response: ResponseConfig<S>) => boolean;
  }

  // 响应参数
  export interface ResponseConfig<S = unknown> {
    data: S;
    status: number;
  }

  export interface AdapterConstruct<Q = unknown> {
    new (config: RequestConfig<Q>): Adapter<Q>;
  }
  // 适配器
  export abstract class Adapter<Q = unknown> {
    request<S = unknown>(): Promise<ResponseConfig<S>>;
    abort(): void;
  }
}
