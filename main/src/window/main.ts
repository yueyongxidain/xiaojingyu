import { app, BrowserWindow, Menu } from 'electron'
import * as path from 'path'
import * as url from 'url'

// 操作窗口
function createMainWindow() {
  if (global.mainWindow) {
    return
  }
  Menu.setApplicationMenu(null)
  // 检测剪切板是否存在可疑的任务
  const hash = `#`
  const window = new BrowserWindow({
    width: 1020,
    height: 647,
    resizable: false,
    autoHideMenuBar: true,
    minimizable: true,
    show: false,
    titleBarStyle: 'hidden',
    icon:
      process.platform !== 'darwin' &&
      (!!app.isPackaged
        ? path.join(__dirname, '../.Render/favicon.ico')
        : path.join(__dirname, '../../render/public/favicon.ico')),
    title: '小鲸鱼',
    transparent: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: true, // 集成 Nodejs
      devTools: true
    }
  })
  if (!!app.isPackaged) {
    // 生产
    window.loadURL(
      url.format({
        pathname: path.join(__dirname, '../.Render/main.html'), // 注意这里修改
        hash,
        protocol: 'file:',
        slashes: true
      })
    )
    // window.webContents.openDevTools()
  } else {
    // 开发测试
    window.loadURL(`http://localhost:3000/main.html${hash}`)
    // window.loadURL(
    //   url.format({
    //     pathname: path.join(__dirname, '../../../.Render/main.html'), // 注意这里修改
    //     hash,
    //     protocol: 'file:',
    //     slashes: true
    //   })
    // )
    window.webContents.openDevTools()
  }
  global.mainWindow = window
  window.on('ready-to-show', function () {
    window.show() // 初始化后再显示
  })
  window.on('close', function () {
    global.mainWindow = undefined
  })
  return window
}

function closeMainWindow() {
  if (global.mainWindow) {
    global.mainWindow.close()
    global.mainWindow = undefined
  }
}

export { createMainWindow, closeMainWindow }
