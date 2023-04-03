import { Adapter, PrierRequest, PrierResponse } from "prier";

declare module "prier" {
  export interface PrierConfig extends RequestInit {}
}

export default class FetchAdapter implements Adapter {
  private abortController: AbortController;
  private signal: AbortSignal;
  private abortTimer: number;

  async request<D = unknown, R = unknown>(
    req: PrierRequest<D>,
    res: PrierResponse<R, D>
  ): Promise<PrierResponse<R, D>> {
    const config = req.getConfig();
    const { url, baseURL, method, headers: _headers, timeout, data, signal } = config;
    if (!signal) {
      const abortController = new AbortController();
      this.abortController = abortController;
      this.signal = abortController.signal;
    }

    // 头信息转换
    const headers = new Headers();
    for (const [key, value] of _headers.entries()) {
      headers.set(key, value);
    }

    // 处理超时
    if (timeout) {
      this.abortTimer = setTimeout(() => {
        this.abort();
      }, timeout);
    }
    // 请求超时
    this.signal.addEventListener("abort", () => {
      req.emit("abort");
    });

    const ret = await fetch(new URL(url, baseURL), {
      signal,
      headers,
      method,
      body: data as BodyInit,
    });
    return res.setStatus(ret.status, ret.statusText).send(ret.body as R);
    // return res.send(
    //   new PrierResponse({
    //     data: ret.body as R,
    //   })
    // );
  }
  abort() {
    if (this.abortController) {
      this.abortController.abort();
    } else {
      // 如果用户主动传入了signal 中断请求的操作交给用户自己处理
      throw new Error("Can not abort request, because signal is customised.");
    }
    clearTimeout(this.abortTimer);
  }
}
