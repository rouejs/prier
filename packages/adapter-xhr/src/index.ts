import { Adapter, PrierRequest, PrierResponse, PrierHeaders } from "prier";

declare module "prier" {
  export interface PrierConfig {
    withCredentials?: boolean;
  }
}

const isPlainObject = (arg: any): arg is Record<string, any> =>
  Object.prototype.toString.call(arg) === "[object Object]" && arg !== null;

const hasContentType = (headers: PrierHeaders) => {
  return Array.from(headers.keys()).find((key) => key.toLowerCase() === "content-type");
};

export default class FetchAdapter implements Adapter {
  private xhr: XMLHttpRequest;

  async request<D = unknown, R = unknown>(req: PrierRequest<D>): Promise<PrierResponse<R, D>> {
    this.xhr = new XMLHttpRequest();
    const config = req.getConfig();
    const { url, baseURL, method, headers: _headers, timeout, data } = config;
    this.xhr.open(method, new URL(url, baseURL));

    let finalData: unknown;

    // 对content-type进行处理
    if (!hasContentType(_headers)) {
      // 如果传入的数据是一个普通的json对象 则设置content-type为application/json
      if (isPlainObject(data)) {
        _headers.set("Content-Type", "application/json");
        finalData = JSON.stringify(data);
      } else {
        // 否则设置为application/x-www-form-urlencoded
        _headers.set("Content-Type", "application/x-www-form-urlencoded");
      }
    }
    for (const [key, value] of _headers.entries()) {
      this.xhr.setRequestHeader(key, value);
    }

    // 处理超时
    if (timeout) {
      this.xhr.timeout = timeout;
    }

    return new Promise((resolve, reject) => {
      this.xhr.addEventListener("abort", (e) => {
        reject(new Error("abort"));
      });
      this.xhr.addEventListener("error", (e) => {
        reject(e);
      });
      this.xhr.addEventListener("load", (e) => {});
      this.xhr.addEventListener("loadstart", (e) => {
        e.total;
      });
      this.xhr.addEventListener("loadend", (e) => {
        const { status, statusText, responseText, response } = this.xhr;
        resolve(
          new PrierResponse({
            status,
            statusText,
            data: (responseText || response) as R,
          })
        );
      });
      this.xhr.addEventListener("progress", (e) => {
        const { total, loaded } = e;
        req.emit("progress", {
          total,
          loaded,
        });
      });
      this.xhr.addEventListener("timeout", (e) => {
        reject(new Error("request timeout"));
      });

      this.xhr.send(data as XMLHttpRequestBodyInit);
    });
  }
  abort() {
    this.xhr.abort();
  }
}
