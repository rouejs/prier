import AbortSignal from "./abortSignal";
export default class AbortController {
  signal: AbortSignal = new AbortSignal();

  abort(reason: string) {
    this.signal.abort(reason);
  }

  toString() {
    return "[object AbortController]";
  }
}
