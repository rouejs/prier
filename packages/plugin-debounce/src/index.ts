import { definePrierPlugin } from "prier";

declare module "prier" {
  export interface PrierConfig {
    debounce?: number;
  }
}

interface IDebouncePluginOptions {
  debounce?: number;
}

// 注册防抖插件

export default definePrierPlugin<IDebouncePluginOptions>({
  name: "debounce",
  install(prier, config) {
    const state = new Map();
    // 默认配置参数
    config = { debounce: 1000, ...config };
    return async (req, res) => {
      const requestConfig = req.getConfig();
      requestConfig.debounce = requestConfig.debounce === undefined ? config.debounce : requestConfig.debounce;
      // 配置了防抖时间
      if (requestConfig.debounce > 0) {
        const token = req.getToken();
        const now = Date.now();
        const lastTime = state.get(token);
        // 判断是否还在防抖时间内
        if (lastTime && now - lastTime < requestConfig.debounce) {
          return res.send(new Error("debounce"));
        }
        state.set(token, now);
        setTimeout(() => {
          // 防抖时间结束后删除token
          state.delete(token);
        }, requestConfig.debounce);
      }
      // 执行下一个插件
      return req.next();
    };
  },
});
