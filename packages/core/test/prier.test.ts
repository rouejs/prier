import { Adapter, Prier } from "../src";
import { Headers } from "../src/headers";
import debounce from "../src/plugins/debounce";
import { PrierConfig, PrierResponse } from "../src/typing";

interface MyConfig<D = unknown> extends PrierConfig<D> {
  xxxx: number;
}

class TestAdapter extends Adapter {
  abort(): void {
    throw new Error("Method not implemented.");
  }
  request<D = unknown, R = unknown>(option: MyConfig<D>): Promise<PrierResponse<R, D>> {
    console.log(option);
    return Promise.resolve<PrierResponse<R, D>>({
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      config: option,
      data: {} as R,
    });
  }
}

test("test", () => {
  const prier = new Prier({
    adapter: TestAdapter,
  });

  prier.use(debounce, {
    wait: 1000,
  });

  prier
    .request<{ c: number }, { a: number }>({
      baseURL: "http://pvp.qq.com",
      timeout: 2000,
      headers: new Headers(),
      data: {
        c: 2,
      },
      reqToken: "test",
    })
    .then((x) => {
      console.log(x);
      x.data.a;
    });
  prier
    .request<{ c: number }, { a: number }>({
      baseURL: "http://pvp.qq.com",
      timeout: 2000,
      headers: new Headers(),
      data: {
        c: 2,
      },
      reqToken: () => {
        return `a+b`;
      },
    })
    .then((x) => {
      console.log(x);
      x.data.a;
    });
});
