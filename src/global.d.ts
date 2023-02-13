Headers;
declare namespace Prier {
  type TMethod = "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "PURGE" | "LINK" | "UNLINK";
  interface IConfig<T = unknown> {
    baseURL?: string;
    url?: string;
    // 请求方法
    method?: TMethod | string;
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
  }

  interface Request<T = unknown> {}

  interface Response<T = unknown, C = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
    config: IConfig<C>;
    request?: any;
  }
}
