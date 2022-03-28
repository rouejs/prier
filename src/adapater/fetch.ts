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
    // 处理超时
    const id = setTimeout(() => this.abort(), this.config.timeout);

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
    return new Promise<Prier.ResponseConfig<S>>(() => {});
  }
  abort() {
    this.controller.abort();
  }
}
