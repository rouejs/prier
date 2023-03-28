import { definePrierPlugin } from "@prier/core";
import { StoreConfig, Store } from "@prier/store";

interface IStorePluginState {
  lastTime: Map<string, number>;
}

// 注册缓存插件

export default definePrierPlugin<Partial<StoreConfig>>({
  name: "cache",
  install(prier, config) {
    const store = new Store(config);
    return (reqConfig) => {
      return new Promise((resolve, reject) => {
        // if (config.wait > 0) {
        //   const token = prier.getReqToken(reqConfig);
        //   const now = Date.now();
        //   const lastTime = state.lastTime.get(token);
        //   if (lastTime && now - lastTime < config.wait) {
        //     reject(new Error("debounce"));
        //   }
        //   state.lastTime.set(token, now);
        //   setTimeout(() => {
        //     state.lastTime.delete(token);
        //   }, config.wait);
        // }
        resolve(reqConfig);
      });
    };
  },
});
