import { Prier } from "prier";
import AdapterFetch from "@prier/adapter-fetch";
import debounce from "../src";
const prier = new Prier({
  adapter: AdapterFetch,
  baseURL: "http://pvp.qq.com",
  reuse: true,
});
test("test", () => {
  prier.use(debounce, {
    reuse: true,
  });

  prier
    .request<{ c: number }, { a: number }>({
      baseURL: "http://pvp.qq.com",
      data: {
        c: 2,
      },
      reuse: true,
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
