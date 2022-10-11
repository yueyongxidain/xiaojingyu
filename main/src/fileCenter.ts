import { app } from 'electron'
import * as fs from 'fs'
import * as moment from 'moment'
import * as path from 'path'
import * as Store from 'electron-store'

interface IConfig {
  downloadPath: string
  lastFilePath?: string
  lastDatarray?: number[]
  lastHostory?: any[]
  lastDataSource?: any[]
}

export class FileCenter {
  public instance: this
  private lastExportParams
  private store: Store<IConfig>
  private fileTitle = '编号,X,Y,深度,GPS高程,GPS状态'
  constructor() {
    this.store = new Store({
      name: 'config'
    })
  }

  public readFile(filePath: string) {
    const lastFilePath = this.store.get('lastFilePath')
    if (filePath !== lastFilePath) {
      this.save(filePath, [], [], [])
    }
    const content = fs.readFileSync(filePath, { encoding: 'utf8' })
    const positions = content.toString().split('\r\n')
    positions.shift()
    this.sendToRender(positions)
  }

  public sendToRender(positions: any[]) {
    global.mainWindow.webContents.send('positions', positions)
  }

  public getDataFromRender(params) {
    this.lastExportParams = params
    global.mainWindow.webContents.send('getDataSource')
  }

  public saveAs(data) {
    const { dataSource = [], dataArray = [] } = data
    const downloadPath = this.store.get('downloadPath')
    const { mime, interval, gpsStatus } = this.lastExportParams
    const content = [this.fileTitle]
    let curInterval = 0
    dataSource.forEach((d, index) => {
      const arr = d.split(',')
      arr[3] = dataArray[index] || arr[3]
      if (
        (+arr[arr.length - 1] === gpsStatus || gpsStatus === 0) &&
        curInterval === 0
      ) {
        content.push(arr.join(','))
      }
      curInterval++
      if (curInterval > interval - 1) {
        curInterval = 0
      }
    })
    const filePath = path.join(
      downloadPath || app.getPath('downloads'),
      moment().format('YYYYMMDDHHmmss') + (mime === 'CSV' ? '.csv' : '.txt')
    )
    // TODO 更具数据参数存储到文件
    fs.writeFileSync(
      filePath,
      (mime === 'CSV' ? `\ufeff` : '') + content.join('\r\n'),
      { encoding: 'utf8' }
    )
    return filePath
  }

  public save(lastFilePath, lastDatarray, lastHostory, lastDataSource) {
    if (lastFilePath) {
      this.store.set('lastFilePath', lastFilePath)
    }
    if (lastDatarray) {
      this.store.set('lastDatarray', lastDatarray)
    }
    if (lastHostory) {
      this.store.set('lastHostory', lastHostory)
    }
    if (lastDataSource) {
      this.store.set('lastDataSource', lastDataSource)
    }
  }

  public reOpen() {
    const lastFilePath = this.store.get('lastFilePath')
    const lastDatarray = this.store.get('lastDatarray')
    const lastHostory = this.store.get('lastHostory')
    const lastDataSource = this.store.get('lastDataSource')
    if (lastFilePath) {
      this.readFile(lastFilePath)
    }
    if (!!lastDatarray || !!lastHostory || !!lastDataSource) {
      this.sendHistoryToRender({ lastDatarray, lastHostory, lastDataSource })
    }
  }

  public getHistory() {
    global.mainWindow.webContents.send('getHistory')
  }

  public getDownloadPath() {
    const downloadPath =
      this.store.get('downloadPath') || app.getPath('downloads')
    return downloadPath
  }

  public setDownloadPath(downloadPath) {
    this.store.set('downloadPath', downloadPath)
  }
  public sendHistoryToRender(params) {
    global.mainWindow.webContents.send('sendHistoryToRender', params)
  }
}
