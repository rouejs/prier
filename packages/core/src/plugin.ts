import type { Prier } from "./prier";
import type { PrierRequest } from "./request";
import type { PrierResponse } from "./response";

// 插件返回值支持三种类型
export type TPluginReturn<T = unknown, R = unknown> = PrierRequest<T, R> | Error | PrierResponse<R, T>;

export type PrierPluginResult<T = unknown, R = unknown> = (
  // 请求对象
  req: PrierRequest<T, R>,
  // 响应对象
  res: PrierResponse<R, T>,
  // 插件的执行序号
  index: number
) => Promise<TPluginReturn<T, R>>;

export interface PrierPlugin<T = unknown> {
  // 插件名字
  name?: string;
  // install有返回值的情况下，会将该高阶函数添加至请求时的待处理函数列表，更像是中间件的概念
  // 没有返回值的情况下，则只是简单的执行install函数，可以在install函数中对prier进行扩展
  // 如添加一些自定义的属性或者方法，这个就更像是vue的plugin那种设计
  install: (prier: Prier, config?: T) => PrierPluginResult | void;
}

// 定义插件 主要是用于类型推断，暂时未对相关的值做什么额外的处理，和直接定义一个对象等价
// 之所以还需要这么一个函数，是为了后期好扩展
export const definePrierPlugin = <T = unknown>(plugin: PrierPlugin<T>) => {
  return plugin;
};
