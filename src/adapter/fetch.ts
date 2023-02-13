import Adapter from "../adapter";
import type Request from "../request";
import type Response from "../response";

export default class implements Adapter {
  async request(req: Request): Promise<Response> {
    const { url, method, headers, body, signal } = req;
    return fetch(url, { method, headers, body: body as BodyInit | null, signal });
  }
  abort(): void {}
}
