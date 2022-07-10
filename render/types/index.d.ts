/// <reference types="electron" />
declare module NodeJS {
  interface Global {
    uploadFinishSizeCacheMap: Map
    uploadcurrentFileNameCacheMap: Map
    // 上传进度缓存
    uploadPercent: Map
    // 下载完成size缓存，用于计算速度
    downloadFinishSize: Map
    // 下载进度缓存
    downloadPercent: Map
    mainWindow: Electron.BrowserWindow
    loginWindow: Electron.BrowserWindow
  }
}

declare module '*.json' {
  const value: any
  export default value
}
interface Window {
  require: NodeRequire
}
declare module "*.svg" {
  const value: any;
  export = value;
}