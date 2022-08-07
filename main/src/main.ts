import { app, ipcMain, Menu, Notification } from 'electron'
import { FileCenter } from './fileCenter'
import * as _ from 'lodash'
import { GlobalMenu } from './menu'
import { createMainWindow } from './window/main'
global.config = {
  COMMAND_LINE: {
    'disable-web-security': true,
    'ignore-certificate-errors': true
  }
}

class SupreAntApp {
  powerBlockerId: number
  public init() {
    // 初始化
    this.singleton()
    this.registeWindow()
    this.registeCommandLine()
    this.registeMenu()
    this.registeFileCenter()
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

  private registeFileCenter() {
    global.fileCenter = new FileCenter()
    ipcMain.on('export', (event, params) => {
      global.fileCenter.getDataFromRender(params)
    })

    ipcMain.on('sendDataSource', (event, params) => {
      try {
        const filePath = global.fileCenter.saveAs(params)
        new Notification({
          title: '导出成功',
          body: `文件存储到：${filePath}`
        }).show()
        global.settingWindow.webContents.send('finishExport')
      } catch (err) {
        new Notification({
          title: '导出失败',
          body: `失败信息：${err.message}`
        }).show()
        global.settingWindow.webContents.send('errorExport')
      }

      // TODO 通知导出页面 完成导出
    })

    ipcMain.on('getReOpen', (event, params) => {
      global.fileCenter.reOpen()
    })

    ipcMain.on('sendHistory', (event, params) => {
      const { dataArray, dataSource, history } = params
      global.fileCenter.saveHistory(undefined, dataArray, history, dataSource)
    })
  }

  /**
   * 菜单设置
   */
  private registeMenu() {
    const globalMenu = new GlobalMenu()
    Menu.setApplicationMenu(globalMenu.instance)
  }
}
const supreAnt = new SupreAntApp()

// app 周期方法函数
app.on('ready', () => {
  supreAnt.init()
})
