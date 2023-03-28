export type HeadersInit = [string, string][] | Record<string, string> | Record<string, string[]> | PrierHeaders;

export class PrierHeaders {
  headers: Record<string, string[]> = {};

  constructor(headers: HeadersInit = {}) {
    if (headers instanceof PrierHeaders) {
      headers.forEach((key, value) => {
        this.set(key, value);
      });
    } else if (Array.isArray(headers)) {
      for (const [key, value] of headers) {
        this.set(key, value);
      }
    } else {
      Object.keys(headers).forEach((key) => {
        this.set(key, headers[key]);
      });
    }
  }

  append(name: string, value: string | string[]) {
    this.headers[name] = (this.headers[name] || []).concat(value);
  }

  delete(name: string) {
    delete this.headers[name];
  }

  *entries(): IterableIterator<[string, string]> {
    for (const name of Object.keys(this.headers)) {
      yield [name, this.get(name)];
    }
  }

  forEach<ThisArg = this>(
    callback: (this: ThisArg, value: string, name: string, parent: this) => void,
    thisArg?: ThisArg
  ) {
    for (const name in this.headers) {
      callback.call(thisArg, this.get(name), name, this);
    }
  }

  get(name: string): string {
    return this.headers[name] ? this.headers[name].join(", ") : null;
  }

  has(name: string): boolean {
    return this.headers.hasOwnProperty(name);
  }

  *keys(): IterableIterator<string> {
    for (const name of Object.keys(this.headers)) {
      yield name;
    }
  }

  set(name: string, value: string | string[]) {
    this.headers[name] = [].concat(value);
  }

  *values(): IterableIterator<string> {
    for (const name of Object.keys(this.headers)) {
      yield this.get(name);
    }
  }

  [Symbol.iterator]() {
    return this.entries();
  }
}
