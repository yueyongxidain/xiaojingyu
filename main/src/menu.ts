import { dialog, ipcMain } from 'electron'
import { createSettingWindow } from './window/setting'

export class GlobalMenu {
  constructor() {
    ipcMain.on('openFile', (event, params) => {
      this.openFile()
    })
    ipcMain.on('saveFile', (event, params) => {
      this.saveFile()
    })
    ipcMain.on('saveAs', (event, params) => {
      this.saveAs()
    })
  }
  private async openFile() {
    const filePathResult = await dialog.showOpenDialog(global.mainWindow, {
      title: '选择数据文件',
      filters: [{ name: 'txt/csv', extensions: ['txt', 'csv'] }],
      properties: ['openFile']
    })
    global.fileCenter.readFile(filePathResult.filePaths[0])
    global.fileCenter.saveHistory(
      filePathResult.filePaths[0],
      undefined,
      undefined,
      undefined
    )
  }

  private saveFile() {
    global.fileCenter.getHistory()
  }

  private saveAs() {
    createSettingWindow()
  }
}
