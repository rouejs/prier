import { definePrierPlugin } from "../plugin";

interface IDebouncePluginOptions {
  wait: number;
}

// 注册防抖插件

export default definePrierPlugin<IDebouncePluginOptions>({
  name: "debounce",
  install(prier, config) {
    const state = new Map();
    return async (req, res) => {
      // 配置了防抖时间
      if (config.wait > 0) {
        const token = req.getToken();
        const now = Date.now();
        const lastTime = state.get(token);
        // 判断是否还在防抖时间内
        if (lastTime && now - lastTime < config.wait) {
          return res.send(new Error("debounce"));
        }
        res.send("xxxx");
        state.set(token, now);
        setTimeout(() => {
          // 防抖时间结束后删除token
          state.delete(token);
        }, config.wait);
      }
      // 执行下一个插件
      return req.next();
    };
  },
});
