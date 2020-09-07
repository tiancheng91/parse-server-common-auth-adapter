# parse-server-common-auth-adapter

### usage

```js
// cloudcode

var commonAuth = require('parse-server-common-auth-adapter');
Parse.Cloud.define('auth.wechat', commonAuth.wechatAuth);

// parse.options
ParseServer.options = {
  auth: {
    wechat: {
      module: commonAuth
    }
  }
}

export WECHAT_APPID = "abcd"
export WECHAT_SECERT = "abce"
```
