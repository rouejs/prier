import type Request from "./request";
import type Response from "./response";
export default abstract class Adapter<T = unknown> {
  // request 发送请求
  abstract request(req: Request<T>): Promise<Response>;

  // abort 中断请求
  abstract abort(): void;
}
