import { definePrierPlugin, PrierRequest, PrierResponse, TPluginReturn } from "prier";

declare module "prier" {
  export interface PrierConfig {
    reuse?: boolean;
  }
}

interface IReusePluginOptions {
  reuse?: boolean;
}

// 注册防抖插件

export default definePrierPlugin<IReusePluginOptions>({
  name: "reuse",
  install(prier, config) {
    config = { reuse: true, ...config };

    const state = new Map<string, PrierRequest>();
    return async (req, res) => {
      const requestConfig = req.getConfig();
      requestConfig.reuse = requestConfig.reuse === undefined ? config.reuse : requestConfig.reuse;
      if (requestConfig.reuse === false) {
        return req.next();
      }
      const token = req.getToken();
      const cached = state.get(token);
      if (cached) {
        // 有缓存的情况下，将请求功能转换成等待前一个请求完成
        const ret = await new Promise<TPluginReturn>((resolve) => {
          cached.on("complete", (ret: TPluginReturn) => {
            resolve(ret);
          });
        });
        if (ret instanceof PrierRequest) {
          return res.send(ret.response);
        }
        return res.send(ret);
      } else {
        state.set(token, req);
        await req.next();
        state.delete(token);
      }
    };
  },
});
