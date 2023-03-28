import { Adapter, Config } from "@prier/core";

class WxBody {
  body: ReadableStream<Uint8Array>;
  bodyUsed: boolean;
  constructor(private originBody: string | ArrayBuffer) {}
  async arrayBuffer(): Promise<ArrayBuffer> {
    if (typeof this.originBody === "string") {
      if (!("TextEncoder" in window)) {
        throw Error("TextEncoder is not available");
      }
      const encoder = new TextEncoder();
      return encoder.encode(this.originBody);
    }
    return this.originBody;
  }
  async blob(): Promise<Blob> {
    throw new Error("Blob invalide in miniprogram.");
  }
  async formData(): Promise<FormData> {
    throw new Error("FormData invalide in miniprogram.");
  }
  async json(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async text(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

class WxRequest extends WxBody implements Request {
  cache: RequestCache;
  credentials: RequestCredentials;
  destination: RequestDestination;
  headers: Headers;
  integrity: string;
  keepalive: boolean;
  method: string;
  mode: RequestMode;
  redirect: RequestRedirect;
  referrer: string;
  referrerPolicy: ReferrerPolicy;
  signal: AbortSignal;
  url: string;

  constructor(config: Config);
  constructor(input: string | WxRequest, config?: Config) {
    super(config);
  }

  clone(): Request {
    throw new Error("Method not implemented.");
  }
}

class WxResponse extends WxBody implements Response {
  headers: Headers;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;
  clone(): Response {
    throw new Error("Method not implemented.");
  }
}

export default class implements Adapter<WxRequest, WxResponse> {
  request(req: WxRequest): Promise<WxResponse> {
    return Promise.resolve(new WxResponse("xxxxx"));
  }
}
