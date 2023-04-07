# Prier

> 一个异常灵活且功能强大的请求工具

## 安装

```shell
npm install prier
```

### 快速开始

> `Prier` 需要配合请求适配器(`adapter`)才能真正地实现请求

以微信小程序为例

```ts
import WXAdapater from "@prier/adapter-wx";
const prier = new Prier({
  adapter: WXAdapater,
});

prier.request({}).then((ret) => {
  console.log(ret);
});
```

### 适配器

### 中间件

> 通过使用中间件，我们可以非常灵活地对请求的各个阶段进行控制，进而实现如请求复用、缓存、防抖、错误重试等功能

#### 中间件使用

```typescript
// 请求复用
import reuse from "@prier/plugin-reuse";
// 配置复用插件，默认为启用
prier.use(reuse);

// 下面相同的请求发送了两次，但是实际上只会有一个请求发送，但是两次的成功回调都会触发
prier.request({ url: "https://yourdomain.com", reqToken: "testToken" }).then(() => {});
prier.request({ url: "https://yourdomain.com", reqToken: "testToken" }).then(() => {});
```
