export default class EventEmitter {
  private events: Record<string, Function[]> = {};
  /**
   * 监听事件
   *
   * @param {string} event
   * @param {Function} listener
   * @memberof EventEmitter
   */
  on(event: string, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  /**
   * 解除事件监听
   *
   * @param {string} event
   * @param {Function} listener
   * @return {*}
   * @memberof EventEmitter
   */
  off(event: string, listener: Function): void {
    if (!this.events[event]) {
      return;
    }
    this.events[event] = this.events[event].filter((fn) => fn !== listener);
  }
  /**
   * 触发事件
   *
   * @param {string} event
   * @param {...unknown[]} args
   * @return {*}
   * @memberof EventEmitter
   */
  emit(event: string, ...args: unknown[]): void {
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach((fn) => fn(...args));
  }
}
