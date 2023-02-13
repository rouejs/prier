import type Headers from "./headers";
import AbortController from "./abortController";
import type AbortSignal from "./abortSignal";
interface Option<T = unknown> {
  method?: Prier.TMethod;
  headers?: Headers;
  body?: T;
  signal?: AbortSignal;
}

export default class<T = unknown> {
  url: string;

  signal: AbortSignal;
  method: Prier.TMethod;
  body: T;
  headers: Headers;

  constructor(urlOrOption: string | Option, option: Option<T> = {}) {
    if (typeof urlOrOption === "string") {
      this.url = urlOrOption;
    }

    if (!option.signal) {
      const abort = new AbortController();
      this.signal = abort.signal;
    }
    this.method = option.method;
    this.headers = option.headers;
    this.body = option.body;
  }
}
