import { PrierHeaders, HeadersInit } from "./headers";
import { PrierPluginInstall } from "./plugin";
import { PrierConfig } from "./typing";

export class PrierRequest {
  private config: PrierConfig;
  private headers: PrierHeaders;
  private plugins: PrierPluginInstall[] = [];
  constructor(config: PrierConfig, plugin: PrierPluginInstall[] = []) {
    this.config = {
      method: "GET",
      headers: new PrierHeaders(),
      ...config,
    };
    this.headers = this.config.headers;
    this.plugins = [...plugin];
  }
  /**
   * 获取请求的token
   *
   * @return {*}  {string}
   * @memberof PrierRequest
   */

  getToken(): string {
    const { reqToken } = this.config;
    if (typeof reqToken === "string") {
      return reqToken;
    } else if (typeof reqToken === "function") {
      return reqToken(this.config);
    }
    return `req_${Math.random().toString(36).slice(2)}`;
  }

  getConfig(): PrierConfig {
    return {
      ...this.config,
      headers: this.headers,
    };
  }
  setConfig(config: PrierConfig) {
    this.config = {
      ...this.config,
      ...config,
    };
  }
  /**
   * 设置请求头
   *
   * @param {HeadersInit} headers 头信息
   * @memberof PrierRequest
   */
  setHeaders(headers: HeadersInit) {
    const header = new PrierHeaders(headers);
    header.forEach((value, key) => {
      this.headers.set(key, value);
    });
  }
  next() {
    return this.plugins.shift();
  }
}
