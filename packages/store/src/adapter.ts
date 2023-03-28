import type { SetStoreItemStruct, GetStoreItemStruct, StoreConfig } from "./typing";

export abstract class Adapter {
  abstract set<T = unknown>(option: SetStoreItemStruct<T>): T;
  abstract get<T = unknown>(option: GetStoreItemStruct<T>): T;
  abstract clear(namespace?: string): void;
  abstract refresh(namespace: string, key: string, ttl: number): void;
  abstract expireCheck(): void;
}
