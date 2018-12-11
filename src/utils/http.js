import axios from 'axios'
// import iView from 'iview'

let qs = require('qs')

axios.defaults.baseURL = ''
axios.defaults.withCredentials = true

function http (config) {
  return new Promise((resolve, reject) => {
    axios(config).then(response => {
      if (response.data.code) {
        if (response.data.code !== '0') {
          if (response.data.code === '3') { // 未登录
            window.location.href = '/'
          }
          // } else {
          //   iView.Message.error({
          //     content: response.data.info,
          //     duration: 5,
          //     closable: true
          //   })
          // }
        }
      }
      resolve(response.data)
    }).catch(err => {
      // iView.Message.error('网络请求发生错误！')
      reject(err)
    })
  })
}

/**
 * 封装get方法
 * @param url 要请求的url地址
 * @param params 请求的参数
 * @returns {Promise}
 */
export function fetch (url, params = {}) {
  return http({
    method: 'GET',
    url: url,
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'platform': 'PC'
    }
  })
}

/**
* 封装post请求
* @param url 要请求的url地址
* @param data 请求的参数
* @returns {Promise}
*/
export function post (url, data = {}) {
  return http({
    method: 'POST',
    url: url,
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function postBlob (url, data = {}) {
  return http({
    method: 'POST',
    url: url,
    responseType: 'blob',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function jsonPost (url, data = {}) {
  return http({
    method: 'POST',
    url: url,
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export function filePost (url, data = {}) {
  return http({
    method: 'POST',
    url: url,
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
/**
* 封装patch请求
* @param url 要请求的url地址
* @param data 请求的参数
* @returns {Promise}
*/

export function patch (url, data = {}) {
  return http({
    method: 'PATCH',
    url: url,
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'platform': 'PC'
    }
  })
}

/**
* 封装put请求
* @param url 要请求的url地址
* @param data 请求的参数
* @returns {Promise}
*/

export function put (url, data = {}) {
  return http({
    method: 'PUT',
    url: url,
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'platform': 'PC'
    }
  })
}
