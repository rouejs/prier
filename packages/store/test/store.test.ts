import { Store } from "../src/store";

const store = new Store({});

test("store", () => {
  store.set("foo", "bar");
  expect(store.get("foo")).toBe("bar");

  store.set({
    key: "foo",
    value: "bar2",
  });
  expect(store.get("foo")).toBe("bar2");
});
