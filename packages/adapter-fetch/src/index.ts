import { Adapter } from "@prier/core";
import { PrierConfig, PrierResponse } from "@prier/core/dist/typing";

export default class FetchAdapter implements Adapter {
  private abortController: AbortController;
  private abortTimer: number;

  async request<D = unknown, R = unknown>(option: PrierConfig<D>): Promise<PrierResponse<R, D>> {
    const abortController = new AbortController();
    this.abortController = abortController;

    const { url, baseURL, method, headers: _headers, timeout, data } = option;

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

    const res = await fetch(new URL(url, baseURL), {
      signal: abortController.signal,
      headers,
      method,
      body: data as BodyInit,
    });

    return {
      status: res.status,
      statusText: res.statusText,
      headers: _headers,
      config: option,
      data: res.body as R,
    };
  }
  abort() {
    this.abortController.abort();
    clearTimeout(this.abortTimer);
  }
}
