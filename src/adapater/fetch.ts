export default class FetchAdapter<Q = unknown> implements Prier.Adapter<Q> {
  controller: AbortController;
  constructor(private config: Prier.RequestConfig<Q>) {
    // console.log(config);
    this.controller = new AbortController();
  }

  request<S = unknown>() {
    // headers转换
    const headers = new Headers();
    for (const [key, value] of Object.entries(this.config.headers)) {
      headers.set(key, value.toString());
    }

    return new Promise<Prier.ResponseConfig<S>>((resolve, reject) => {
      // 处理超时
      const id = setTimeout(() => {
        this.abort();
        reject(new Error("Request Timeout"));
        // TODO: 处理超时逻辑
      }, this.config.timeout);
      // /** A BodyInit object or null to set request's body. */
      // body?: BodyInit | null;
      // /** A string indicating how the request will interact with the browser's cache to set request's cache. */
      // cache?: RequestCache;
      // /** A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. */
      // credentials?: RequestCredentials;
      // /** A Headers object, an object literal, or an array of two-item arrays to set request's headers. */
      // headers?: HeadersInit;
      // /** A cryptographic hash of the resource to be fetched by request. Sets request's integrity. */
      // integrity?: string;
      // /** A boolean to set request's keepalive. */
      // keepalive?: boolean;
      // /** A string to set request's method. */
      // method?: string;
      // /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
      // mode?: RequestMode;
      // /** A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect. */
      // redirect?: RequestRedirect;
      // /** A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. */
      // referrer?: string;
      // /** A referrer policy to set request's referrerPolicy. */
      // referrerPolicy?: ReferrerPolicy;
      // /** An AbortSignal to set request's signal. */
      // signal?: AbortSignal | null;
      // /** Can only be null. Used to disassociate request from any Window. */
      // window?: null;
      fetch(this.config.url, {
        method: this.config.method,
        signal: this.controller.signal,
        headers,
      })
        .then((response) => {
          response.json();
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          clearTimeout(id);
        });
    });
  }
  abort() {
    this.controller.abort();
  }
}
