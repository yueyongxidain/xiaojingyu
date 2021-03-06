import { app, dialog, Menu } from 'electron'

const isMac = process.platform === 'darwin'
export class GlobalMenu {
  public instance: Menu
  private template = [
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
        { label: '打开', click: () => this.openFile() },
        { type: 'separator' },
        { label: '保存', click: () => this.saveFile() },
        { type: 'separator' },
        { label: '数据导出', click: () => this.saveAs() }
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
  constructor() {
    this.instance = Menu.buildFromTemplate(this.template as any)
  }
  private async openFile() {
    if (!this.instance) {
      return
    }
    const filePathResult = await dialog.showOpenDialog(global.mainWindow, {
      title: '选择数据文件',
      filters: [{ name: 'txt/csv', extensions: ['txt', 'csv'] }],
      properties: ['openFile']
    })
    console.log(filePathResult.filePaths)
    global.fileCenter.readFile(filePathResult.filePaths[0])
  }

  private saveFile() {
    if (!this.instance) {
      return
    }
    console.log('保存文件')
  }

  private saveAs() {
    if (!this.instance) {
      return
    }
    console.log('另存为')
  }
}
