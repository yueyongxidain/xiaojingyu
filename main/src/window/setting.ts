import { app, BrowserWindow, Menu } from 'electron'
import * as path from 'path'
import * as url from 'url'
// 设置窗口
function createSettingWindow(parent, point, hash?, search?) {
  if (global.settingWindow) {
    global.settingWindow.restore()
    return
  }
  Menu.setApplicationMenu(null)
  const window = new BrowserWindow({
    width: 480,
    height: 342,
    ...point,
    fullscreen: false,
    fullscreenable: false,
    title: '用户设置',
    autoHideMenuBar: true,
    resizable: false,
    parent: global.mainWindow,
    icon:
      process.platform !== 'darwin' &&
      (!!app.isPackaged
        ? path.join(__dirname, '../.Render/favicon.ico')
        : path.join(__dirname, '../../render/public/favicon.ico')),
    webPreferences: {
      nodeIntegration: true, // 集成 Nodejs
      devTools: true
    },
    minimizable: false,
    show: false
  })
  if (!!app.isPackaged) {
    window.loadURL(
      url.format({
        pathname: path.join(__dirname, '../.Render/setting.html'), // 注意这里修改
        protocol: 'file:',
        hash,
        search,
        slashes: true
      })
    )
  } else {
    window.loadURL(
      `http://localhost:3000/setting.html${hash || ''}${search || ''}`
    )
    window.webContents.openDevTools()
  }
  global.settingWindow = window
  window.on('ready-to-show', function () {
    // 初始化后再显示

    window.show()
    // 位置移动特效
    const mainBound = global.mainWindow.getBounds()
    window.setBounds(
      {
        x: Math.ceil(mainBound.x + mainBound.width / 2 - 480 / 2),
        y: Math.ceil(mainBound.y + mainBound.height / 2 - 342 / 2)
      },
      true
    )
  })
  window.on('close', function () {
    global.settingWindow = null
  })
  return window
}
export { createSettingWindow }
