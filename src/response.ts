import Headers from "./headers";
interface Option {
  status: number;
  statusText: string;
  headers: Headers;
}
fetch("a").then((ret) => {
  ret.json();
});
type TBody = string | Blob | ArrayBuffer | DataView | FormData | URLSearchParams | ReadableStream;

abstract class ResponseBody {
  readonly body: ReadableStream<Uint8Array> | null;
  readonly bodyUsed: boolean;
  abstract arrayBuffer(): Promise<ArrayBuffer>;
  abstract blob(): Promise<Blob>;
  abstract formData(): Promise<FormData>;
  abstract json<T = unknown>(): Promise<T>;
  abstract text(): Promise<string>;
}

export default abstract class extends ResponseBody {
  status: number;
  statusText: string;
}

// export default class Response<T = unknown> {
//   body: ReadableStream;
//   bodyUsed: boolean;
//   headers: Headers;
//   status: number;
//   statusText: string;

//   data: T;
//   config: any;

//   constructor(body?: T, private readonly options: Partial<Option> = {}) {
//     Object.assign(this, {
//       body,
//       bodyUsed: false,
//       headers: new Headers(),
//       status: 200,
//       statusText: "success",
//       ...this.options,
//     });
//   }

//   arrayBuffer() {}

//   blob() {}

//   clone() {
//     return new Response(this.body, this.options);
//   }

//   formData() {}

//   json() {
//     // return JSON.parse(this.text());
//   }

//   text() {
//     return new Promise((resolve, reject) => {
//       const decoder = new TextDecoder();
//       this.body
//         .getReader()
//         .read()
//         .then(({ value, done }) => {
//           if (!done) {
//             decoder.decode(value, { stream: !done });
//           } else {
//             resolve(decoder);
//           }
//         });
//     });
//   }

//   private getBodyType() {
//     if (typeof this.body === "string") {
//       return "string";
//     } else if (Blob.prototype.isPrototypeOf(this.body)) {
//       return "Blob";
//     } else if (DataView.prototype.isPrototypeOf(this.body)) {
//       return "DataView";
//     } else if (ArrayBuffer.prototype.isPrototypeOf(this.body)) {
//       return "ArrayBuffer";
//     } else if (FormData.prototype.isPrototypeOf(this.body)) {
//       return "FormData";
//     } else if (URLSearchParams.prototype.isPrototypeOf(this.body)) {
//       return "URLSearchParams";
//     } else {
//       return "ReadableStream";
//     }
//   }
// }
