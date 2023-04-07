import type { PrierRequest } from "./request";

const DEFAULT_STATUS_TEXT = "pending";

export interface IPrierResponseOption<R = unknown, D = unknown> {
  // 响应数据
  data: R;
  // 响应状态码
  status: number;
  // 响应状态信息
  statusText: string;
  // 请求对象
  request: PrierRequest<D, R>;
}

export class PrierResponse<R = unknown, D = unknown> {
  status: number = 0;
  statusText: string = DEFAULT_STATUS_TEXT;
  data: R = null;
  request: PrierRequest<D, R> = null;
  constructor(option: Partial<IPrierResponseOption<R, D>> = {}) {
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
  send(data: R): this;
  send(response: PrierResponse<R, D>): this;
  send(dataOrError: R | PrierResponse<R, D> | Error): Promise<Error> | this {
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
