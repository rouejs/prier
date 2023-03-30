import { Adapter, Prier, PrierRequest, PrierResponse } from "../src";
import { PrierHeaders } from "../src/headers";
class TestAdapter extends Adapter {
  abort(): void {
    throw new Error("Method not implemented.");
  }
  async request<D = unknown, R = unknown>(req: PrierRequest<D>): Promise<PrierResponse<R, D>> {
    console.log(req);
    return new PrierResponse({
      status: 200,
      statusText: "OK",
      headers: req.getConfig().headers,
      config: req.getConfig(),
      data: {} as R,
    });
  }
}

test("test", () => {
  const prier = new Prier({
    adapter: TestAdapter,
  });

  prier
    .request<{ c: number }, { a: number }>({
      baseURL: "http://pvp.qq.com",
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
