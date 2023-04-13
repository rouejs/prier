import { Adapter, PrierRequest, PrierResponse } from "prier";

declare module "prier" {
  export interface PrierConfig extends RequestInit {}
}
const dataMap: Record<string, (rsp: Response) => unknown> = {
  arraybuffer(rsp) {
    return rsp.arrayBuffer();
  },
  blob(rsp) {
    return rsp.blob();
  },
  async document(rsp) {
    const text = await rsp.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, "text/html");
  },
  json(rsp) {
    return rsp.json();
  },
  text(rsp) {
    return rsp.text();
  },
  stream(rsp) {
    return rsp.body;
  },
};

export default class FetchAdapter implements Adapter {
  private abortController: AbortController;
  private signal: AbortSignal;
  private abortTimer: number;

  async request<D = unknown, R = unknown>(
    req: PrierRequest<D>,
    res: PrierResponse<R, D>
  ): Promise<PrierResponse<R, D>> {
    const config = req.getConfig();
    const { url, baseURL, method, headers: _headers, timeout, data, signal, responseType } = config;
    this.signal =
      signal ||
      this.signal ||
      (function () {
        var ctrl = new AbortController();
        return ctrl.signal;
      })();

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

    // 发送请求
    const ret = await fetch(new URL(url, baseURL), {
      signal: this.signal,
      headers,
      method,
      body: data as BodyInit,
    });
    res.setStatus(ret.status, ret.statusText);
    const bodyData = await dataMap[responseType](ret);
    return res.send(bodyData as R);
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
