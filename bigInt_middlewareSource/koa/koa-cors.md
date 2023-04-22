<!--
 * @Author: thunderchen
 * @Date: 2023-01-14 22:02:59
 * @LastEditTime: 2023-01-14 22:15:49
 * @email: 853524319@qq.com
 * @Description: @koa/cors源码分析
-->

## @koa/cors源码解析
github地址: https://github.com/koajs/cors

直接上源码

```js
'use strict';

const vary = require('vary');

/**
 * CORS middleware
 *
 * @param {Object} [options] 配置对象参数解释
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 * @return {Function} cors middleware
 * @api public
 */
module.exports = function(options) {
  // 默认配置
  const defaults = {
    // Access-Control-Allow-Methods 必须字段，表示服务器支持的跨域HTTP方法、返回的是所有支持方法
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // 合并option、defaults默认配置允许被覆盖
  options = {
    ...defaults,
    ...options,
  };

  // 组装options
  // CORS很多响应头value都是允许多个逗号分隔的字符串
  if (Array.isArray(options.exposeHeaders)) {
    options.exposeHeaders = options.exposeHeaders.join(',');
  }

  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(',');
  }

  if (Array.isArray(options.allowHeaders)) {
    options.allowHeaders = options.allowHeaders.join(',');
  }

  if (options.maxAge) {
    options.maxAge = String(options.maxAge);
  }

  options.keepHeadersOnError = options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;

  // 返回Koa中间件
  return async function cors(ctx, next) {
    // If the Origin header is not present terminate this set of steps.
    // The request is outside the scope of this specification.
    // 默认获取的是ctx.request.origin
    const requestOrigin = ctx.get('Origin');

    // Always set Vary header
    // https://github.com/rs/cors/issues/10
    ctx.vary('Origin');

    // 如果没有origin头、直接终止流程
    if (!requestOrigin) return await next();

    // 处理不同情况下origin的获取
    let origin;
    if (typeof options.origin === 'function') {
      origin = options.origin(ctx);
      if (origin instanceof Promise) origin = await origin;
      if (!origin) return await next();
    } else {
      origin = options.origin || requestOrigin;
    }

    // 处理不同场景下的credentials
    // Access-Control-Allow-Credentials：可选、布尔值、表示是否允许发送Cookie
    // Cookie默认不包含在CORS请求中，设为true表示服务器许可、
    // 如果不需要直接删除该字段即可
    let credentials;
    if (typeof options.credentials === 'function') {
      credentials = options.credentials(ctx);
      if (credentials instanceof Promise) credentials = await credentials;
    } else {
      credentials = !!options.credentials;
    }

    const headersSet = {};

    // 设置响应头
    function set(key, value) {
      ctx.set(key, value);
      headersSet[key] = value;
    }

    if (ctx.method !== 'OPTIONS') {
      // CORS 之 简单请求、浏览器直接发出CORS请求，并且在浏览器请求头添加Origin字段
      // 简单请求：
      // 1、请求方法：HEAD、GET、POST
      // 2、HTTP头信息字段限制，Accept、Accept-Language、Content-Language、Content-Type:只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain
      // 设置接收来自origin域名的请求
      set('Access-Control-Allow-Origin', origin);

      // 只有为true时候才设置
      if (credentials === true) {
        // 设置允许客户端发送Cookies
        set('Access-Control-Allow-Credentials', 'true');
      }

      // CORS请求，XHR对象的getResponseHeader方法只能获取6个基本字段
      // Cache-Control Content-Language Content-Type Expires Last-Modified Pragma
      // 因此如果你需要获取其它字段、则需要在Access-Control-Expose-Headers指定
      if (options.exposeHeaders) {
        set('Access-Control-Expose-Headers', options.exposeHeaders);
      }

      // 如果没有设置keepHeadersOnError、那么直接进入下个中间件
      if (!options.keepHeadersOnError) {
        return await next();
      }
      try {
        return await next();
      } catch (err) {
        // 这里个人理解不多，当出现异常时候，将之前cors设置的相关headers挂栽在err上抛出
        const errHeadersSet = err.headers || {};
        const varyWithOrigin = vary.append(errHeadersSet.vary || errHeadersSet.Vary || '', 'Origin');
        delete errHeadersSet.Vary;

        err.headers = {
          ...errHeadersSet,
          ...headersSet,
          ...{ vary: varyWithOrigin },
        };
        throw err;
      }
    } else {
      // 预检请求：非简单请求即为预检请求、比如PUT、DELETE方法或者Content-Type: application/json。
      // 如果是一个非简单请求的CORS请求，在正式通信之前，会增加一次HTTP查询请求，称为预检请求
      // 预检请求使用的HTTP方法是OPTION，所以你知道上面为什么用OPTION作为判断了
      
      // 预检请求目的：浏览器发起请求，询问服务器，当前网页是否在服务器允许的origin名单内
      // 以及想知道允许使用哪些HTTP Method、头信息字段等
      // 只有得到正确答复、才会发出正式的XHR请求

      // 预检请求一般包括的字段有
      // Origin: http://api.bob.com 必须会带上
      // Access-Control-Request-Method: PUT // 必须，这里PUT指的是浏览器预检请求后的XHR请求方法
      // Access-Control-Request-Headers: X-Custom-Header // 可选

      // 服务器接收预检请求后，会检测Origin、Access-Control-Allow-Methods、以及Access-Control-Request-Headers      
      // 如果请求头不存在Access-Control-Request-Method头、或者解析失败、流程直接终止
      if (!ctx.get('Access-Control-Request-Method')) {
        // this not preflight request, ignore it
        return await next();
      }

      // 检测正确，允许跨源请求，作出响应
      // 设置返回请求域白名单
      ctx.set('Access-Control-Allow-Origin', origin);

      // 设置允许浏览器CORS请求发送Cookies
      if (credentials === true) {
        ctx.set('Access-Control-Allow-Credentials', 'true');
      }

      // 可选，指定本次预检请求的有效期，单位秒
      // 在该有效期内 不再需要发送预检请求
      if (options.maxAge) {
        ctx.set('Access-Control-Max-Age', options.maxAge);
      }

      // 设置服务器支持的所有跨域方法
      if (options.allowMethods) {
        ctx.set('Access-Control-Allow-Methods', options.allowMethods);
      }

      // 设置服务器支持的所有头信息字段
      let allowHeaders = options.allowHeaders;
      if (!allowHeaders) {
        // 如果没有自定义、从请求中获取
        allowHeaders = ctx.get('Access-Control-Request-Headers');
      }
      // 自定义扩展
      if (allowHeaders) {
        ctx.set('Access-Control-Allow-Headers', allowHeaders);
      }
      // 204 服务器处理请求、但是没有返回内容
      ctx.status = 204;
    }
  };
};
```