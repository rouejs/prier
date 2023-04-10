import { definePrierPlugin, PrierRequest, TPluginReturn } from "prier";

declare module "prier" {
  export interface PrierConfig {
    retryTimes?: number;
    retryDelay?: number;
  }
}

interface IRetryPluginOptions {
  retryTimes?: number;
  retryDelay?: number;
}

// 注册防抖插件

export default definePrierPlugin<IRetryPluginOptions>({
  name: "retry",
  install(prier, config) {
    config = { retryTimes: 0, retryDelay: 300, ...config };
    return async (req, res, index) => {
      const requestConfig = req.getConfig();
      const { retryTimes = config.retryTimes, retryDelay = config.retryDelay } = requestConfig;
      if (retryTimes === 0) {
        return req.next();
      }
      let leftRetryTimes = retryTimes;
      let ret = await req.next(index + 1);
      // TODO: 对于一些steam类型的请求，需要实现stream的重试
      // 有重试次数的情况下，需要循环执行
      while (ret instanceof Error && leftRetryTimes > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        ret = await req.next(index + 1);
        leftRetryTimes--;
      }
      return ret;
    };
  },
});
