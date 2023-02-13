type EventHandler = (event: Event) => void;

export default class EventEmitter {
  private listeners: Record<string, EventHandler[]>;

  /**
   * 事件绑定
   *
   * @template T
   * @param {string} events
   * @param {EventHandler<T>} handler
   * @memberof EventEmitter
   */
  addEventListener(events: string, handler: EventHandler): void {
    this.each(events, (event) => {
      if (Object.prototype.hasOwnProperty.call(this.listeners, event)) {
        this.listeners[event].push(handler);
      } else {
        this.listeners[event] = [handler];
      }
    });
  }
  /**
   * 事件触发
   */
  dispatchEvent<T = unknown>(event: Event): boolean {
    if (Object.prototype.hasOwnProperty.call(this.listeners, event.type)) {
      this.listeners[event.type].forEach((handler) => {
        handler.call(this, event);
      });
    }
    return false;
  }
  /**
   * 移除事件
   *
   * @param {string} events 事件名称 多个事件通过英文逗号(,)分割
   * @param {EventHandler} handler 需要移除的函数句柄 如果不传入的话 全部移除
   * @memberof EventEmitter
   */
  removeEventListener(events: string, handler?: EventHandler): void {
    this.each(events, (event) => {
      if (Object.prototype.hasOwnProperty.call(this.listeners, event)) {
        if (handler) {
          this.listeners[event] = this.listeners[event].filter((item) => handler !== item);
        } else {
          delete this.listeners[event];
        }
      }
    });
  }

  private each(events: string, handler: (event: string) => void): void {
    events.split(",").forEach((event) => {
      handler(event.trim());
    });
  }
}
