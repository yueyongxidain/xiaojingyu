import { net } from 'electron'
import * as qs from 'querystring'

export function apiFetch(input, init = {}) {
  return new Promise((resolve, reject) => {
    const request = net.request({
      method: 'GET',
      url: input,
      ...init
    })
    request.setHeader('Content-type', 'application/json')
    request.on('response', (response) => {
      const statusCode = response.statusCode
      // 接受数据
      let res = ''
      response.on('data', (chunk) => {
        res += chunk.toString()
      })
      // 解析数据
      response.on('end', () => {
        // 1. 判断状态码
        if (statusCode === 401) {
          // TODO 无权限
        } else if (statusCode >= 200 || statusCode < 400) {
          if (
            (response.headers['content-type'] as any).startsWith(
              'application/json'
            )
          ) {
            resolve(JSON.parse(res))
          } else {
            resolve(res)
          }
        }
      })
    })
    request.on('error', (e) => {
      reject(e.message)
    })
    if (init['body']) {
      request.write(init['body'])
    }
    request.end()
  })
}
export function downloadFetch(input, stream: NodeJS.WritableStream) {
  return new Promise((resolve, reject) => {
    const request = net.request({
      method: 'GET',
      url: input
    })
    request.setHeader('Content-type', 'application/json')
    request.on('response', (response) => {
      const statusCode = response.statusCode
      // 接受数据
      response.on('data', (chunk) => {
        stream.write(chunk)
      })
      // 解析数据
      response.on('end', () => {
        // 1. 判断状态码
        if (statusCode === 401) {
          // TODO 无权限
        } else if (statusCode >= 200 || statusCode < 400) {
          resolve(null)
        }
      })
    })
    request.on('error', (e) => {
      reject(e.message)
    })
    stream.on('error', (err) => {
      // electronLog.error(`out error`, err)
      request.abort()
      reject('下载失败')
    })
    request.end()
  })
}
export function apiFetchGet(url, query = {}) {
  return this.apiFetch(`${url}?${qs.stringify(query)}`)
}

export function apiFetchPost(url, body) {
  return this.apiFetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(body)
  })
}
