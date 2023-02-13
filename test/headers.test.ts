import Headers from "../src/headers";

describe("headers", () => {
  const headers = new Headers({
    a: "1",
    b: "2",
    c: "3",
    d: "4",
  });

  test("get", () => {
    expect(headers.get("d")).toBe("4");
  });

  test("append", () => {
    headers.append("e", "foo");
    expect(headers.get("e")).toBe("foo");

    headers.append("e", ["xxxx", "bar"]);
    expect(headers.get("e")).toBe("foo, xxxx, bar");
  });

  test("delete", () => {
    headers.delete("e");
    expect(headers.get("e")).toBe(null);
  });

  test("entries", () => {
    var arr = [...headers.entries()];
    expect(arr.length).toBe(4);

    for (const header of headers.entries()) {
      expect(header[0]).toBe("a");
      break;
    }
  });

  test("forEach", () => {
    let first: string = "";
    headers.forEach((_, name) => {
      if (first === "") {
        first = name;
      }
    });
    expect(first).toBe("a");
  });

  // for (const header of headers.entries()) {
  //   console.log(header);
  // }
});
