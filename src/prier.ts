import { initConfig } from "./helper/defaults";
export class Prier {
  globalConfigs: Prier.RequestConfig;
  constructor(configs: Partial<Prier.RequestConfig>) {
    this.globalConfigs = initConfig(configs);
  }
  request<R = unknown, S = unknown>(config: Partial<Prier.RequestConfig<R>>): Promise<S>;
  request<R = unknown, S = unknown>(url: string, config?: Partial<Prier.RequestConfig<R>>): Promise<S>;
  request<R = unknown, S = unknown>(
    urlOrConfig: Partial<Prier.RequestConfig<R>> | string,
    config: Partial<Prier.RequestConfig<R>> = {}
  ): Promise<S> {
    if (typeof urlOrConfig === "string") {
      config = { ...config, url: urlOrConfig };
    } else {
      config = urlOrConfig;
    }

    const finalConfig = initConfig(config, this.globalConfigs);

    if (!config.adapter) {
      throw new Error("adapter can not be undefined");
    }

    const adapter = new config.adapter(finalConfig);

    adapter.request<S>();

    return new Promise<S>((resolve, reject) => {});
  }
}
