import EventEmitter from "./eventEmitter";

export default class AbortSignal extends EventEmitter {
  aborted: boolean = false;
  constructor(public reason: string = "", public onabort: (reason: any) => void = () => {}) {
    super();
  }

  abort(reason: string) {
    // super.dispatchEvent("abort", reason || this.reason);
    super.dispatchEvent(new CustomEvent("abort"));
    this.aborted = true;
  }

  throwIfAborted() {}

  toString() {
    return "[object AbortSignal]";
  }
}

Response;
