import { initConfig } from "./helper/defaults";
export class Prier {
  defaults: Prier.RequestConfig;
  interceptors = {
    request: "",
    response: "",
  };
  constructor(configs: Partial<Prier.RequestConfig>) {
    this.defaults = initConfig(configs);
  }
  /**
   *
   *
   * @template R
   * @template S
   * @param {Partial<Prier.RequestConfig<R>>} config
   * @return {*}  {Promise<S>}
   * @memberof Prier
   */
  request<R = unknown, S = unknown>(config: Partial<Prier.RequestConfig<R>>): Promise<S>;
  /**
   *
   *
   * @template R
   * @template S
   * @param {string} url
   * @param {Partial<Prier.RequestConfig<R>>} [config]
   * @return {*}  {Promise<S>}
   * @memberof Prier
   */
  request<R = unknown, S = unknown>(url: string, config?: Partial<Prier.RequestConfig<R>>): Promise<S>;
  /**
   *
   *
   * @template R
   * @template S
   * @param {(Partial<Prier.RequestConfig<R>> | string)} urlOrConfig
   * @param {Partial<Prier.RequestConfig<R>>} [config={}]
   * @return {*}  {Promise<S>}
   * @memberof Prier
   */
  request<R = unknown, S = unknown>(
    urlOrConfig: Partial<Prier.RequestConfig<R>> | string,
    config: Partial<Prier.RequestConfig<R>> = {}
  ): Promise<S> {
    if (typeof urlOrConfig === "string") {
      config = { ...config, url: urlOrConfig };
    } else {
      config = urlOrConfig;
    }

    const finalConfig = initConfig(config, this.defaults);

    if (!config.adapter) {
      throw new Error("adapter can not be undefined");
    }

    const adapter = new config.adapter(finalConfig);

    adapter.request<S>();

    return new Promise<S>((resolve, reject) => {});
  }

  abort() {}
}
