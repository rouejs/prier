import { definePrierPlugin } from "@prier/core";
import { StoreConfig, Store } from "@prier/store";

// 注册缓存插件

export default definePrierPlugin<Partial<StoreConfig>>({
  name: "cache",
  install(prier, config) {
    const store = new Store(config);
    return async (req, res) => {
      const token = req.getToken();
      const data = await store.get(token);
      if (data) {
        return res.send({ data });
      }
      return req.next();
    };
  },
});
