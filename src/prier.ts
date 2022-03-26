export class Prier {
  constructor(public defaults: RequestConfig) {}
  request<T>(url: string): Promise<T>;
  request<T>(Config: RequestConfig): Promise<T>;
  request<T>(urlOrConfig: string | RequestConfig): Promise<T> {
    return new Promise<T>((resolve, reject) => {});
  }
}
