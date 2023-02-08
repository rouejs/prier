export default class XMLAdapter<Q = unknown> extends XMLHttpRequest implements Prier.Adapter<Q> {
  constructor(private config: Prier.RequestConfig<Q>) {
    super();
    this.open(config.method, config.url, true);
  }

  request<S = unknown>() {
    // 设置请求头headers
    for (const [key, value] of Object.entries(this.config.headers)) {
      this.setRequestHeader(key, value.toString());
    }

    // 配置超时
    this.timeout = this.config.timeout;

    return new Promise<Prier.ResponseConfig<S>>((resolve, reject) => {
      // 处理
      this.addEventListener("loadend", (ev) => {
        const rspHeaders = this.getAllResponseHeaders();
      });
      this.addEventListener("timeout", (ev) => {});

      this.send(null);
    });
  }
  abort() {
    super.abort();
  }
}
