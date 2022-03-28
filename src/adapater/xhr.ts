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

    // 处理
    this.addEventListener("abort", () => {});
    this.addEventListener("error", () => {});
    this.addEventListener("process", () => {});
    this.addEventListener("timeout", () => {});

    this.send(null);
    return new Promise<Prier.ResponseConfig<S>>(() => {});
  }
  abort() {
    super.abort();
  }
}
