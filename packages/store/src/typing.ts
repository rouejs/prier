import { Adapter } from "./adapter";

export interface StoreConfig {
  namespace: string;
  ttl: number;
  max: number;
  adapter?: Adapter;
}

export interface StoreItemStruct {
  namespace?: string;
  key?: string;
}
export interface GetStoreItemStruct<T = unknown> extends StoreItemStruct {
  defaultValue?: T;
}
export interface SetStoreItemStruct<T = unknown> extends StoreItemStruct {
  value?: T;
  ttl?: number;
}
