import { PrierHeaders } from "./headers";
import { PrierRequest } from "./request";
import { PrierConfig } from "./typing";

export interface IPrierResponseOption<T = unknown, K = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: PrierHeaders;
  config: PrierConfig<K>;
  request: PrierRequest;
}

export class PrierResponse<T = unknown, K = unknown> {
  status: number = 200;
  statusText: string = "OK";
  data: T = null;
  headers: PrierHeaders = new PrierHeaders();
  request: PrierRequest = null;
  config: PrierConfig<K> = null;
  constructor(option: Partial<IPrierResponseOption<T, K>> = {}) {
    Object.assign(this, option);
  }

  setStatus(status: number) {
    this.status = status;
    return this;
  }

  send(err: Error): Promise<Error>;
  send(data: T): this;
  send(dataOrError: T | Error): Promise<Error> | this {
    if (dataOrError instanceof Error) {
      this.statusText = dataOrError.message;
      return Promise.reject(dataOrError);
    }
    this.data = dataOrError;
    return this;
  }
}
