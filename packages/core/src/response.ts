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
/**
 * 响应对象
 *
 * @export
 * @class PrierResponse
 * @template R
 * @template D
 */
export class PrierResponse<R = unknown, D = unknown> {
  /**
   * 响应状态码
   *
   * @type {number}
   * @memberof PrierResponse
   */
  status: number = 0;
  /**
   * 响应文案
   *
   * @type {string}
   * @memberof PrierResponse
   */
  statusText: string = DEFAULT_STATUS_TEXT;
  /**
   * 服务器响应内容
   *
   * @type {R}
   * @memberof PrierResponse
   */
  data: R = null;
  /**
   * 该响应对应的请求对象
   *
   * @type {PrierRequest<D, R>}
   * @memberof PrierResponse
   */
  request: PrierRequest<D, R> = null;
  /**
   * Creates an instance of PrierResponse.
   * @param {Partial<IPrierResponseOption<R, D>>} [option={}] 响应配置
   * @memberof PrierResponse
   */
  constructor(option: Partial<IPrierResponseOption<R, D>> = {}) {
    Object.assign(this, option);
  }
  /**
   * 设置响应状态
   *
   * @param {number} status 响应码
   * @param {string} [statusText=""] 响应文案
   * @return {*}
   * @memberof PrierResponse
   * @example
   * res.setStatus(200, "OK");
   */
  setStatus(status: number, statusText: string = ""): this {
    this.status = status;
    if (statusText) {
      this.statusText = statusText;
    }
    return this;
  }
  /**
   * 返回一个错误的响应
   *
   * @param {Error} err 错误信息
   * @return {*}  {Promise<Error>}
   * @memberof PrierResponse
   * @example
   * res.setStatus(403).send(new Error('403 Forbidden'))
   */
  send(err: Error): Promise<Error>;
  /**
   * 直接返回对应的服务器内容
   *
   * @param {R} data 返回的内容
   * @return {*}  {this}
   * @memberof PrierResponse
   * @example
   * res.setStatus(200).send({a:1, b:2})
   */
  send(data: R): this;
  /**
   * 返回一个响应对象
   *
   * @param {PrierResponse<R, D>} response 响应对象
   * @return {*}  {this}
   * @memberof PrierResponse
   * @example
   * res.send(new PrierReponse({}))
   */
  send(response: PrierResponse<R, D>): this;
  send(dataOrError: R | PrierResponse<R, D> | Error): Promise<Error> | this {
    if (dataOrError instanceof Error) {
      this.statusText = dataOrError.message;
      this.status = this.status || 500;
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
