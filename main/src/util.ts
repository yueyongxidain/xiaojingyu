import * as fs from 'fs'
import * as path from 'path'
import * as _ from 'lodash'
import { execSync } from 'child_process'
import { app, dialog } from 'electron'
import * as electronLog from 'electron-log'
const fsExit = (filepath: string) => {
  fs.accessSync(filepath || '', fs.constants.F_OK)
}
// 同步获取文件大小
const fileSize = (
  filepath: string,
  hasUnit: boolean = false
): number | string => {
  if (!!filepath) {
    try {
      fsExit(filepath)
      if (process.platform === 'darwin') {
        const realFilepath = filepath.replace(/\s/g, '\\ ')
        const cmd = `du ${hasUnit ? '-sh' : '-s -k'} ${realFilepath}`
        const count: any = execSync(cmd)
        const detail = count.toString().split('/')[0]
        return hasUnit ? _.trim(detail) : _.ceil(_.trim(detail))
      } else {
        const duPath = path.resolve(
          app.isPackaged ? process.resourcesPath : '../',
          './extraResources/du.exe'
        )
        const cmd = `${duPath} -u "${filepath}" /accepteula`
        let count: any = execSync(cmd)
        count = count.toString()
        let detail: any
        let totalB: number
        let totalK: number | string
        detail = count.toString().match(/Size\:\s+((\d+,)*\d+) byte/)
        if (detail && detail.length > 0) {
          detail = detail[1]
          totalB = detail.replace(/\,/g, '') * 1 || 1
          totalK = (totalB / 1024).toFixed(1)
        }
        if (!hasUnit) {
          return totalK
        } else {
          const totalM: string = (totalB / 1024 / 1024).toFixed(1)
          const totalG: string = (totalB / 1024 / 1024 / 1024).toFixed(1)
          if (_.toNumber(totalG) > 0.1) {
            return totalG + 'GB'
          }
          if (_.toNumber(totalM) > 0.1) {
            return totalM + 'MB'
          }
          return totalK + 'KB'
        }
      }
    } catch (e) {
      electronLog.error(e)
      dialog.showMessageBox({
        message: e.message
      })
      return 1
    }
  }
  return 1
}
async function deleteFolder(filePath) {
  let files = []
  if (fs.existsSync(filePath)) {
    files = await fs.promises.readdir(filePath)
    for (const file of files) {
      const nextFilePath = `${filePath}/${file}`
      const states = fs.statSync(nextFilePath)
      if (states.isDirectory()) {
        // recurse
        await deleteFolder(nextFilePath)
      } else {
        // delete file
        fs.unlinkSync(nextFilePath)
      }
    }
    fs.rmdirSync(filePath)
  }
}
export { fsExit, fileSize, deleteFolder }
