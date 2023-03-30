export default class EventEmitter {
  private events: Record<string, Function[]>;
  constructor() {
    this.events = {};
  }
  on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  off(event: string, listener: Function) {
    if (!this.events[event]) {
      return;
    }
    this.events[event] = this.events[event].filter((fn) => fn !== listener);
  }
  emit(event: string, ...args: unknown[]) {
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach((fn) => fn(...args));
  }
}
