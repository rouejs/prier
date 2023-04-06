import type { PrierRequest } from "./request";

const DEFAULT_STATUS_TEXT = "pending";

export interface IPrierResponseOption<T = unknown, K = unknown> {
  // 响应数据
  data: T;
  // 响应状态码
  status: number;
  // 响应状态信息
  statusText: string;
  // 请求对象
  request: PrierRequest;
}

export class PrierResponse<T = unknown, K = unknown> {
  status: number = 0;
  statusText: string = DEFAULT_STATUS_TEXT;
  data: T = null;
  request: PrierRequest<K, T> = null;
  constructor(option: Partial<IPrierResponseOption<T, K>> = {}) {
    Object.assign(this, option);
  }

  setStatus(status: number, statusText: string = "") {
    this.status = status;
    if (statusText) {
      this.statusText = statusText;
    }
    return this;
  }

  send(err: Error): Promise<Error>;
  send(data: T): this;
  send(response: PrierResponse<T, K>): this;
  send(dataOrError: T | PrierResponse<T, K> | Error): Promise<Error> | this {
    if (dataOrError instanceof Error) {
      this.statusText = dataOrError.message;
      return Promise.reject(dataOrError);
    }
    this.status = this.status || 200;
    this.statusText = this.statusText == DEFAULT_STATUS_TEXT ? "OK" : this.statusText;
    if (dataOrError instanceof PrierResponse) {
      const { status = this.status, statusText = this.statusText, data } = dataOrError;
      Object.assign(this, { status, statusText, data });
      return this;
    }

    this.data = dataOrError;
    return this;
  }
}
