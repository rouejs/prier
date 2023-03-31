import { Adapter, PrierRequest, PrierResponse } from "prier";

declare module "prier" {
  export interface PrierConfig extends WechatMiniprogram.RequestOption {}
}

type TMethod = "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "TRACE" | "CONNECT";

export default class FetchAdapter implements Adapter {
  private requestTask: WechatMiniprogram.RequestTask;

  async request<D = unknown, R = unknown>(req: PrierRequest<D>): Promise<PrierResponse<R, D>> {
    const config = req.getConfig();
    const { url, baseURL, method, headers, timeout, data } = config;

    // header转换
    const header: Record<string, string> = {};
    for (const [key, value] of headers.entries()) {
      header[key] = value;
    }

    const requestOptions: WechatMiniprogram.RequestOption = {
      url: new URL(url, baseURL).toString(),
      method: method as TMethod,
      data,
      header,
      timeout,
    };

    return new Promise((resolve, reject) => {
      this.requestTask = wx.request({
        ...requestOptions,
        success: (res) => {
          const { statusCode, data } = res;
          resolve(
            new PrierResponse({
              status: statusCode,
              statusText: "OK",
              data: data as R,
            })
          );
        },
        fail: (err) => {
          reject(err);
        },
      });
    });

    // // 头信息转换
    // const headers = new Headers();
    // for (const [key, value] of _headers.entries()) {
    //   headers.set(key, value);
    // }

    // // 处理超时
    // if (timeout) {
    //   this.abortTimer = setTimeout(() => {
    //     this.abort();
    //   }, timeout);
    // }

    // const res = await fetch(new URL(url, baseURL), {
    //   signal: abortController.signal,
    //   headers,
    //   method,
    //   body: data as BodyInit,
    // });

    // return new PrierResponse({
    //   status: res.status,
    //   statusText: res.statusText,
    //   headers: _headers,
    //   config: config,
    //   data: res.body as R,
    // });
  }
  abort() {
    this.requestTask.abort();
  }
}
