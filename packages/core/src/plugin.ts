import type { Prier } from "./prier";
import type { PrierConfig } from "./typing";

export type PrierPluginInstall = <T = unknown>(reqConfig: PrierConfig<T>) => Promise<PrierConfig<T>>;

export interface PrierPlugin<T = unknown> {
  name?: string;
  install: (prier: Prier, config?: T) => PrierPluginInstall | void;
}

export const definePrierPlugin = <T = unknown>(plugin: PrierPlugin<T>) => {
  return plugin;
};
