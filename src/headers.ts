export default class {
  headers: Record<string, string[]> = {};

  constructor(headers: Record<string, string | string[]> = {}) {
    Object.keys(headers).forEach((key) => {
      this.headers[key] = (this.headers[key] || []).concat(headers[key]);
    });
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
      if (this.headers.hasOwnProperty(name)) {
        callback.call(thisArg, this.get(name), name, this);
      }
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
