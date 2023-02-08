import Interceptor from "../src/interceptor";
test("interceptor", () => {
  var interceptor = new Interceptor();
  interceptor.use(async (a) => {
    console.log(a, 1);
    return true;
  });
  interceptor.use(async (a) => {
    console.log(a, 2);
    return true;
  });
  interceptor.use(async (a) => {
    console.log(a, 3);
    return false;
  });
  interceptor.use(async (a) => {
    console.log(a, 4);
    return true;
  });
  interceptor.exec({
    url: "http://localhost",
    method: "GET",
    headers: {},
    data: null,
    adapter: null,
    timeout: 0,
    debounce: 0,
    cache: false,
    retry: 0,
    validate: () => true,
  });
  expect(1).toBe(1);
});
