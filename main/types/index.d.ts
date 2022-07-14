/// <reference types="electron" />
declare module NodeJS {
  interface Global {
    uploadCurrentFileFinishSizeMap: Map
    uploadCurrentFileNameMap: Map
    // 上传完成size缓存，用于计算速度
    uploadFinishSizeMap: Map
    oldUploadFinishSizeMap: Map
    uploadPercent: Map
    // 下载完成size缓存，用于计算速度
    downloadFinishSize: Map
    oldDownloadFinishSize: Map
    // 下载进度缓存
    downloadPercent: Map
    preDataPercent: Map
    mainWindow: Electron.BrowserWindow
    detailWindow: Electron.BrowserWindow
    loginWindow: Electron.BrowserWindow
    settingWindow: Electron.BrowserWindow
    downloadTaskWindow: Electron.BrowserWindow
    powerBlockerId: number
    DownloadList: any
    UploadList: any
    newTask: any
    LocalDb: any
    appSession: any
    appUser: any
    anter: any
    config: any
    syncDataer: any
    fileCenter: any
  }
}

declare module '*.json' {
  const value: any
  export default value
}
interface Window {
  require: NodeRequire
}
