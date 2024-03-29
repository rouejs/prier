import { Prier } from "prier";
import AdapterFetch from "@prier/adapter-fetch";
import cache from "../src";
const prier = new Prier({
  adapter: AdapterFetch,
  baseURL: "http://pvp.qq.com",
});
test("test", () => {
  prier.use(cache, {
    namespace: "xxxx",
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
