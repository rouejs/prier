import Adapter from "../adapter";
import type Request from "../request";
import type Response from "../response";

class XHRResponse implements Response {
  status: number;
  statusText: string;
  body: ReadableStream<Uint8Array>;
  bodyUsed: boolean = false;

  constructor(private readonly xhr: XMLHttpRequest) {
    //  response 类型 "" | "arraybuffer" | "blob" | "document" | "json" | "text";
    this.xhr.responseType = this.xhr.responseType || "text";
  }
  async arrayBuffer(): Promise<ArrayBuffer> {
    const { responseType, response } = this.xhr;
    if (responseType === "arraybuffer") {
      return response;
    }
    if (responseType === "text") {
      return readTextAsArrayBuffer(response);
    }
    if (responseType === "blob") {
      return readBlobAsArrayBuffer(response);
    }
    if (responseType === "json") {
      return readTextAsArrayBuffer(JSON.stringify(response));
    }
    throw new Error("Can not Convert to ArrayBuffer");
  }
  async blob(): Promise<Blob> {
    const { responseType, response } = this.xhr;
    if (responseType === "blob") {
      return response;
    }
    if (responseType === "text") {
      return readTextAsBlob(response);
    }
    if (responseType === "json") {
      return readTextAsBlob(JSON.stringify(response));
    }
    if (responseType === "arraybuffer") {
      return readArrayBufferAsBlob(response);
    }
    throw new Error("Can not Convert to ArrayBuffer");
  }
  formData(): Promise<FormData> {
    throw new Error("Method not implemented.");
  }
  async json<T = unknown>(): Promise<T> {
    const { responseType, response } = this.xhr;
    if (responseType === "json") {
      return response;
    }
    const text = await this.text();
    return JSON.parse(text);
  }
  async text(): Promise<string> {
    const { responseType, response } = this.xhr;
    if (responseType == "text") {
      return response;
    }
    if (responseType === "json") {
      return JSON.stringify(response);
    }
    if (responseType === "blob") {
      return readBlobAsText(response);
    }
    if (responseType === "arraybuffer") {
      return readArrayBuffAsText(response);
    }
    throw new Error("Can not Convert to ArrayBuffer");
  }
}

export default class implements Adapter {
  async request(req: Request<Document | XMLHttpRequestBodyInit>): Promise<Response> {
    const { url, method, headers, body, signal } = req;
    const xhr = new XMLHttpRequest();
    return new Promise<Response>((resolve, reject) => {
      xhr.onload = () => {
        resolve(new XHRResponse(xhr));
      };
      xhr.onerror = (e) => {
        reject(e);
      };
      xhr.onabort = () => {
        reject(new TypeError("aborted"));
      };
      xhr.ontimeout = () => {
        reject(new TypeError("timeout"));
      };
      xhr.open(method, url, true);

      if (signal) {
        signal.addEventListener("abort", xhr.abort);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            signal.removeEventListener("abort", xhr.abort);
          }
        };
      }
      for (const [key, value] of headers) {
        xhr.setRequestHeader(key, value);
      }

      xhr.send(body);
    });
  }
  abort(): void {}
}
