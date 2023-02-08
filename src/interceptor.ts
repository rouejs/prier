type BoolPromise = (config: Prier.RequestConfig) => Promise<boolean>;

interface IHandler {
  handler: BoolPromise;
  runWhen: BoolPromise;
}

export default class Interceptor {
  handlers: IHandler[] = [];
  use(handler: BoolPromise, runWhen: BoolPromise = () => Promise.resolve(true)): number {
    return (
      this.handlers.push({
        handler,
        runWhen,
      }) - 1
    );
  }
  eject(id: number) {
    this.handlers.splice(id, 1);
  }
  clear() {
    this.handlers = [];
  }
  async exec(config: Prier.RequestConfig): Promise<boolean> {
    for (let i = 0; i < this.handlers.length; i++) {
      const item = this.handlers[i];
      const { runWhen, handler } = item;
      const canRun = await runWhen(config);
      if (canRun) {
        const ret = await handler(config);
        // 拦截器
        if (ret === false) {
          return ret;
        }
      }
    }
    return true;
  }
}
