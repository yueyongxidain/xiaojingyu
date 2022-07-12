import { app, Menu } from 'electron'
import * as _ from 'lodash'
import { createMainWindow } from './window/main'
global.config = {
  COMMAND_LINE: {
    'disable-web-security': true,
    'ignore-certificate-errors': true
  }
}

const isMac = process.platform === 'darwin'

class SupreAntApp {
  powerBlockerId: number
  public init() {
    // 初始化
    this.singleton()
    this.registeWindow()
    this.registeCommandLine()
    this.registeMenu()
  }

  /**
   * app 单例模式
   */
  private singleton() {
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      app.quit()
    }
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // 当运行第二个实例时,将会聚焦到myWindow这个窗口
      if (global.mainWindow) {
        if (global.mainWindow.isMinimized()) {
          global.mainWindow.restore()
        }
        global.mainWindow.focus()
      }
      if (global.loginWindow) {
        if (global.loginWindow.isMinimized()) {
          global.loginWindow.restore()
        }
        global.loginWindow.focus()
      }
    })
  }

  /**
   * 更具用户处于不同的状态创建不同的窗口
   * 1）公司用户登录模式
   * 2）离线模式
   * 3）登出模式
   */
  private registeWindow() {
    // 处于登录状态
    if (global.mainWindow) {
      if (global.mainWindow.isMinimized()) {
        global.mainWindow.restore()
      }
      global.mainWindow.focus()
    } else {
      createMainWindow()
    }
  }

  private registeCommandLine() {
    const commandLines = global.config.COMMAND_LINE
    for (const key in commandLines) {
      if (commandLines.hasOwnProperty(key)) {
        const value = commandLines[key]
        if (value) {
          app.commandLine.appendSwitch(key, value)
        }
      }
    }
  }

  /**
   * 菜单设置
   */
  private registeMenu() {
    const template = [
      // { role: 'appMenu' }
      ...(isMac
        ? [
            {
              label: app.name,
              submenu: [
                { role: 'about', label: '关于' },
                { type: 'separator' },
                { role: 'hide', label: '隐藏' },
                { type: 'separator' },
                { role: 'quit', label: '退出' }
              ]
            }
          ]
        : []),
      // { role: 'fileMenu' }
      {
        label: '文件',
        submenu: [
          { label: '打开' },
          { type: 'separator' },
          { label: '保存' },
          { type: 'separator' },
          { label: '数据导出' }
        ]
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: async () => {
              const { shell } = require('electron')
              await shell.openExternal('https://electronjs.org')
            }
          }
        ]
      }
    ]
    const menu = Menu.buildFromTemplate(template as any)
    Menu.setApplicationMenu(menu)
  }
}
const supreAnt = new SupreAntApp()

// app 周期方法函数
app.on('ready', () => {
  supreAnt.init()
})
