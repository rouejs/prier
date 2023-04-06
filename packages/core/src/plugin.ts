import type { Prier } from "./prier";
import type { PrierRequest } from "./request";
import type { PrierResponse } from "./response";

export type TPluginReturn<T = unknown, R = unknown> = PrierRequest<T, R> | Error | PrierResponse<R, T>;

export type PrierPluginResult<T = unknown, R = unknown> = (
  req: PrierRequest<T, R>,
  res: PrierResponse<R, T>
) => Promise<TPluginReturn<T, R>>;

export interface PrierPlugin<T = unknown> {
  name?: string;
  install: (prier: Prier, config?: T) => PrierPluginResult | void;
}

export const definePrierPlugin = <T = unknown>(plugin: PrierPlugin<T>) => {
  return plugin;
};
