'use strict'

import * as _ from 'lodash'
import * as qs from 'querystring'

const API_HOST = ''
const API_BASE = `${API_HOST}`

export interface IResponseCollection<T> {
  total: number
  items: T[]
}

export interface IResponse<T> {
  code: number
  data: T
  message?: string
}

export interface IInterceptorParams {
  input: RequestInfo
  init: RequestInit
}

export interface IInterceptor {
  onRequest?: (params: IInterceptorParams) => IInterceptorParams
  onResponse?: (response: Response) => Response
  onData?: (data: any) => any
}

// 拦截器集合
const interceptors: IInterceptor[] = []

/**
 * 添加拦截器
 * @param interceptor
 */
export function intercept(interceptor: IInterceptor) {
  const index = interceptors.indexOf(interceptor)
  if (index === -1) {
    interceptors.push(interceptor)
  }
}

/**
 * 移除拦截器
 * @param interceptor
 */
export function unintercept(interceptor: IInterceptor) {
  const index = interceptors.indexOf(interceptor)
  if (index !== -1) {
    interceptors.splice(index, 1)
  }
}

/**
 * 拦截器校验
 * @param funcProp 所需要校验的方法
 * @param params
 */
export function iterate<P extends keyof IInterceptor>(funcProp: P, params) {
  interceptors.map((interceptor) => {
    if (interceptor[funcProp]) {
      try {
        const callback = interceptor[funcProp] as (params: any) => any
        callback(params)
      } catch (e) {
        // error(e)
      }
    }
  })
}

/**
 * 基础 api 请求方法
 * @param input
 * @param init
 */
export function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const extendedOpts = _.merge(init, {
    headers: {
      Accept: 'application/json',
      'X-Client-Request-ID': Math.random().toString(32).substr(2),
      'Cache-control': 'no-cache'
    },
    redirect: 'follow'
  })

  // 拦截器处理 onRequest 方法，reduce 可保留每次处理过后 params
  const params = interceptors.reduce(
    (_params, interceptor) => {
      if (interceptor.onRequest) {
        try {
          return interceptor.onRequest(_params)
        } catch (e) {
          return _params
        }
      } else {
        return _params
      }
    },
    { input, init: extendedOpts }
  )

  return fetch(`${API_BASE}${params.input}`, params.init)
    .then(
      (res) => {
        // 拦截器处理 onResponse 方法
        iterate('onResponse', res)
        return Promise.all([
          res.status,
          res.statusText,
          res.status === 204 ? null : res.text()
        ])
      },
      (e) => {
        // it will only reject on network failure or
        // if anything prevented the request from completing.
        // error(e)]
        return Promise.reject(e)
      }
    )
    .then(
      ([status, statusText, data]) => {
        let jsonData
        try {
          jsonData = JSON.parse(data)
        } catch (e) {
          jsonData = {
            code: status,
            message: data ? data : statusText
          }
        }
        if (status < 200 || status >= 300) {
          return Promise.reject(jsonData)
        }
        // 拦截器处理 onData 方法
        iterate('onData', jsonData)
        return jsonData
      },
      (e) => {
        // res.json() rejected
        // error(e)
        return Promise.reject(e)
      }
    )
}

export function apiFetchGet(url: RequestInfo, query: any = {}, headers?: any) {
  return apiFetch(`${url}?${qs.stringify(query)}`, { headers })
}

export function apiFetchPost(url: RequestInfo, body?: any, headers?: any) {
  headers = headers || {}

  return apiFetch(url, {
    method: 'POST',
    headers: _.merge(headers, {
      'Content-Type': 'application/json'
    }),
    credentials: 'include',
    body: JSON.stringify(body)
  })
}

export function apiFetchDelete(url: RequestInfo, body?: any, headers?: any) {
  headers = headers || {}

  return apiFetch(url, {
    method: 'DELETE',
    headers: _.merge(headers, {
      'Content-Type': 'application/json'
    }),
    credentials: 'include',
    body: JSON.stringify(body)
  })
}

export function apiFetchPut(url: RequestInfo, body?: any, headers?: any) {
  headers = headers || {}

  return apiFetch(url, {
    method: 'PUT',
    headers: _.merge(headers, {
      'Content-Type': 'application/json'
    }),
    credentials: 'include',
    body: JSON.stringify(body)
  })
}

export function apiFetchPostFile(
  url: RequestInfo,
  body: any = {},
  file: File = null
) {
  const data = new FormData()

  _.forEach(body, (val, key) => {
    data.append(key, val)
  })

  if (file) {
    data.append('file', file, file.name)
  }

  return apiFetch(url, {
    method: 'POST',
    credentials: 'include',
    body: data
  })
}

export function apiFetchPostFileChunk(
  url: RequestInfo,
  body: any = {},
  chunk: Blob
) {
  const data = new FormData()

  _.forEach(body, (val, key) => {
    data.append(key, val)
  })

  data.append('file', chunk)

  return apiFetch(url, {
    method: 'POST',
    credentials: 'include',
    body: data
  })
}

export function exists(url: RequestInfo): Promise<boolean> {
  return fetch(url, {
    method: 'HEAD'
  })
    .then((res) => res.ok)
    .catch(() => false)
}

export async function downloadFile(url: string) {
  const endPoint = url.split('?')[0]
  const filename = endPoint.substring(endPoint.lastIndexOf('/') + 1)
  const a = window.document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  a.remove()
}
