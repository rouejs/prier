import { definePrierPlugin, PrierRequest, PrierResponse } from "prier";
import { StoreConfig, KStore } from "@kstore/core";

declare module "prier" {
  export interface PrierConfig {
    cache?: Partial<StoreConfig> | boolean | number;
  }
}

// 注册缓存插件
export default definePrierPlugin<Partial<StoreConfig>>({
  name: "cache",
  install(prier, config) {
    const store = new KStore(config);
    return async (req, res) => {
      const { cache } = req.getConfig();
      let cacheConfig: Partial<StoreConfig> = {};
      // 如果用户主动配置了cache为false，则不使用缓存
      if (cache === false) {
        return req.next();
      }
      if (cache === true) {
        cacheConfig = { ...config };
      } else if (typeof cache === "number") {
        cacheConfig = { ...config, ttl: cache };
      } else {
        cacheConfig = { ...config, ...cache };
      }
      const token = req.getToken();
      const data = await store.get({ ...cacheConfig, key: token });
      if (data) {
        return res.setStatus(200, "cached").send(data);
      }
      let ret = (await req.next()) || req;
      if (ret instanceof PrierRequest) {
        ret = ret.response;
      }
      if (ret instanceof PrierResponse) {
        // 如果返回的是响应体
        const { status, data } = ret;
        if (status === 200) {
          await store.set({ ...cacheConfig, key: token, value: data });
        }
      }
    };
  },
});
