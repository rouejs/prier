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

  async request<D = unknown, R = unknown>(req: PrierRequest<D>, res: PrierResponse<R>): Promise<PrierResponse<R, D>> {
    this.xhr = new XMLHttpRequest();
    const config = req.getConfig();
    const { url, baseURL, method, headers: _headers, timeout, data, responseType } = config;

    this.xhr.open(method, new URL(url, baseURL));

    this.xhr.responseType = responseType;

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
      // this.xhr.addEventListener("loadstart", (e) => {
      //   e.total;
      // });
      this.xhr.addEventListener("loadend", (e) => {
        const { status, statusText, response } = this.xhr;
        // 只有responseType为空或者text时才能读取responseText 要不然会报错
        const responseData = !responseType || responseType === "text" ? this.xhr.responseText : response;
        res.setStatus(status, statusText);
        resolve(res.send(responseData as R));
      });
      // 监听上传进度
      this.xhr.upload.addEventListener("progress", (e) => {
        const { total, loaded } = e;
        req.emit("upload:progress", {
          total,
          loaded,
        });
      });
      // 监听下载进度
      this.xhr.addEventListener("progress", (e) => {
        const { total, loaded } = e;
        req.emit("download:progress", {
          total,
          loaded,
        });
      });
      this.xhr.addEventListener("timeout", (e) => {
        reject(new Error("request timeout"));
      });

      this.xhr.send((data as XMLHttpRequestBodyInit) || null);
    });
  }
  abort() {
    this.xhr.abort();
  }
}
