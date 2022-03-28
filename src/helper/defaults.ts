import XHRAdapter from "../adapater/xhr";
import FetchAdapter from "../adapater/fetch";

const getDefaultAdapter = <Q = unknown>(adapter: Prier.AdapterConstruct<Q>): Prier.AdapterConstruct<Q> => {
  if (adapter) {
    return adapter;
  } else if (typeof fetch !== "undefined") {
    return FetchAdapter;
  } else if (typeof XMLHttpRequest !== "undefined") {
    return XHRAdapter;
  } else {
    return null;
  }
};

// headerMaps 默认headers
const headerMaps: Partial<Record<Prier.Method, Prier.Headers>> = {
  ...["DELETE", "GET", "HEAD"].reduce<Record<string, Prier.Headers>>((pre, cur) => {
    pre[cur] = {};
    return pre;
  }, {}),
  ...["POST", "PUT", "PATCH"].reduce<Record<string, Prier.Headers>>((pre, cur) => {
    pre[cur] = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    return pre;
  }, {}),
};

// 默认配置参数
const defaults: Prier.DefaultConfig = {
  url: "",
  method: "GET",
  headers: {},
  timeout: 0,
  debounce: 0,
  cache: false,
  validate: (response) => {
    return response.status >= 200 && response.status < 300;
  },
};

// 参数初始化
export const initConfig = <Q = unknown>(
  config: Partial<Prier.RequestConfig<Q>>,
  baseConfig = defaults
): Prier.RequestConfig<Q> => {
  const requestConfig: Prier.RequestConfig<Q> = Object.assign(
    {
      adapter: getDefaultAdapter<Q>(config.adapter),
      data: null,
    },
    baseConfig,
    config
  );

  // headers处理
  requestConfig.headers = Object.assign(
    {
      Accept: "application/json, text/plain, */*",
    },
    headerMaps[requestConfig.method],
    requestConfig.headers
  );

  return requestConfig;
};
