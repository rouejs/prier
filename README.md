# Prier

> 一个异常灵活且功能强大的请求工具

嗯，是的，又是一个轮子 😁。马车的轮子无法用在飞机上，该造的咱还得造。至于为什么要造，因为马车的路子无法用在飞机上(￣ ε(#￣)☆╰╮(￣ ▽ ￣///)

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

> 主要是为了抹平各个平台对于请求发送的差异带给前端同学不同的体验，

比如说在 web 端我们可能采用`XMLHttpRequest`、`fetch`，在小程序端用的是`wx.request`， 而在`node`端使用的是内置`http`模块

#### 适配器使用

现阶段，在初始化 Prier 时，我们*必须*要指定对应的适配器，暂时没有去对各个平台做特征检测进而自动使用对应的适配器，否则是无法正常发送请求的

如上面[`快速开始`](#快速开始)

目前是配置支持如下，详细说明请去到各自对应的文档，使用方法完全一致，不用的适配器，请求参数全兼容原始方法

- 微信适配器
- XMLHttpRequest
- fetch

当然了，我们也可以非常轻松地开发出出属于自己的适配器。但是各位基本上碰不到这种场景

#### 适配器开发

> 文档待完善

### 中间件

> 主要是为了让开发者更好地控制自己的请求

目前支持的中间件如下，详细的配置，请各位开发者移步至对应的说明文档

- 缓存
- 防抖
- 错误重试
- 请求复用

#### 中间件使用

通过`use`方法，我们可以给请求注册属于自己的中间件，同时，在请求过程中，我们也可以通过各中间件支持的参数来对中间件是否有效来进行控制

简单的用法如下：

`prier.use(plugin[, pluginOptions])`

如：

```typescript
// 请求复用
import reuse from "@prier/plugin-reuse";
// 配置复用插件，默认为启用
prier.use(reuse, { reuse: true });

// 下面相同的请求发送了两次，但是实际上只会有一个请求发送，但是两次的成功回调都会触发
prier.request({ url: "https://yourdomain.com", reqToken: "testToken" }).then(() => {});
prier.request({ url: "https://yourdomain.com", reqToken: "testToken" }).then(() => {});
```

一般来说，插件的配置参数都应该是可以通过请求参数来做临时的修改，可以让调用者使用起来更加灵活。
如上面大家看到的，插件支持一个配置参数`reuse`，在安装这个插件的时候，我们设置了改默认值为`true`

也就是说，所有的`相同请求`都会被复用，但是有时候，一些请求并不想被复用，如：数据上报

那么，我们就可以在请求的时候，传入一个配置参数`reuse: false`

```typescript
prier.request({ url: "https://yourdomain.com", reqToken: "testToken" }).then(() => {});
// 因为配置了reuse为false，所以依旧会有两条请求发送
prier.request({ url: "https://yourdomain.com", reqToken: "testToken", reuse: false }).then(() => {});
```

我们需要注意的是，在请求的时候传入`reuse`，只是针对当前这条请求有效,并不会影响到其他

#### 中间件开发
