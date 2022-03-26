declare type Method = "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "HEAD" | "OPTIONS" | "PURGE" | "LINK" | "UNLINK";
declare interface RequestConfig {
  url: string;
  method: Method;
}
