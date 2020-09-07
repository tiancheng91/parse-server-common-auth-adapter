var md5 = requeire("md5")
var Parse = require('parse/node').Parse

function encode(text, key) {
    let code = md5(`${text}.${key}`).slice(0, 6)
    return `${text}.${code}`
}

function decode(data, key) {
    let chunks = data.split('.')
    let code = chunks.pop()
    let text = chunks.join('.')

    return md5(text).slice(0, 6) == code, text
}

// wechatAuth 微信code2session
async function wechatAuth(request) {
    let clientIP = request.ip
    let code = request.params.code;

    let appId = process.env.WECHAT_APPID
    let secret = process.env.WECHAT_SECRET

    let api = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=JSCODE&grant_type=authorization_code`

    try {
        rsp = await Parse.Cloud.httpRequest({
            method: "get",
            url: api
        })
        if (rsp.data && rsp.data.openid) {
            rsp.data.sign = encode(rsp.data.openid, process.env.WECHAT_SECRET)
        }
        return rsp.data
    } catch (error) {
        console.error("[auth.wechat]http error, ", error)
        return {
            "errcode": -1,
            "errmsg": "微信接口请求超时"
        }
    }
}

function validateAuthData(authData, options) {
    let ok, uid = decode(authData.sign)

    if (!ok || uid != authData.id) {
        throw new Parse.Error(
            Parse.Error.OBJECT_NOT_FOUND,
            'Thrid userId is not valid.'
        )
    } else {
        return Promise.resolve()
    }
}

function validateAppId(appIds, authData, options) {
    return Promise.resolve()
}

module.exports = {
  validateAppId: validateAppId,
  validateAuthData: validateAuthData,
  
  wechatAuth: wechatAuth
};