import { Adapter, PrierRequest, PrierResponse } from "prier";

declare module "prier" {
  export interface PrierConfig extends WechatMiniprogram.RequestOption {}
}

type TMethod = "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "TRACE" | "CONNECT";

export default class FetchAdapter implements Adapter {
  private requestTask: WechatMiniprogram.RequestTask;

  async request<D = unknown, R = unknown>(req: PrierRequest<D>, res: PrierResponse<R>): Promise<PrierResponse<R, D>> {
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
        success: (ret) => {
          const { statusCode, data } = ret;
          resolve(res.setStatus(statusCode).send(data as R));
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  }
  abort() {
    this.requestTask.abort();
  }
}
