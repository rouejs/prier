import { Prier, PrierHeaders } from "prier";
import AdapterFetch from "@prier/adapter-fetch";
import debounce from "../src";
const prier = new Prier({
  adapter: AdapterFetch,
  baseURL: "http://pvp.qq.com",
  debounce: 1000,
});
test("test", () => {
  prier.use(debounce, {
    debounce: 1000,
  });

  prier
    .request<{ c: number }, { a: number }>({
      baseURL: "http://pvp.qq.com",
      data: {
        c: 2,
      },
      debounce: 1000,
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
      reqToken: "test",
    })
    .then((x) => {
      console.log(x);
      x.data.a;
    });
});
