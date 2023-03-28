import { definePrierPlugin } from "../plugin";

interface IDebouncePluginOptions {
  wait: number;
}
interface IDebouncePluginState {
  lastTime: Map<string, number>;
}

// 注册防抖插件

export default definePrierPlugin<IDebouncePluginOptions>({
  name: "debounce",
  install(prier, config) {
    const state: IDebouncePluginState = { lastTime: new Map() };
    return (reqConfig) => {
      return new Promise((resolve, reject) => {
        if (config.wait > 0) {
          const token = prier.getReqToken(reqConfig);
          const now = Date.now();
          const lastTime = state.lastTime.get(token);
          if (lastTime && now - lastTime < config.wait) {
            reject(new Error("debounce"));
          }
          state.lastTime.set(token, now);
          setTimeout(() => {
            state.lastTime.delete(token);
          }, config.wait);
        }
        resolve(reqConfig);
      });
    };
  },
});
