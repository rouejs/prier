import EventEmitter from "../src/eventEmitter";

describe("eventEmitter", () => {
  const event = new EventEmitter();

  event.addEventListener("xxx", (e) => {
    console.log(e);
  });
});
