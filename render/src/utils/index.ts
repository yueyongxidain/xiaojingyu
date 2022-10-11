const { remote } = window.require('electron')
const fs = window.require('fs')
const path = window.require('path')
import { downloadVersionFile } from 'main/global/api'
import { parse } from 'yamljs'
import { ceil, toNumber, trim } from 'lodash'
import * as moment from 'moment'
import * as semver from 'semver'
const { exec } = window.require('child_process')
const { dialog, getCurrentWindow } = remote

export async function openFileDirectoryWindow() {
  // 打开文件窗口
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog(
      getCurrentWindow(),
      {
        properties: ['openDirectory', 'multiSelections']
      }
    )
    if (canceled || filePaths.length <= 0) {
      return ''
    } else {
      return filePaths
    }
  } catch (err) {
    throw new Error('打开文件出错了')
  }
}
export async function openFileWindow() {
  // 打开文件窗口
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog(
      getCurrentWindow(),
      {
        properties: ['openFile'],
        filters: [
          {
            name: 'zip',
            extensions: ['zip', 'gz']
          }
        ]
      }
    )
    if (canceled || filePaths.length <= 0) {
      return ''
    } else {
      return filePaths[0]
    }
  } catch (err) {
    throw new Error('打开文件出错了')
  }
}

export function showErrorMessage(message) {
  dialog.showErrorBox(message, '如仍有问题，请联系管理员')
}

// 同步获取文件数量
export async function fileCount(filepath: string) {
  return new Promise((resolve, reject) => {
    if (!!filepath) {
      if (remote.process.platform === 'darwin') {
        const realFilepath = filepath.replace(/\s/g, '\\ ')
        const cmd = `ls -lRa ${realFilepath} |grep "^-"|wc -l`
        exec(cmd, (error: Error, stdout: string, stderr: string) => {
          if (!!stderr) {
            resolve(0)
          }
          resolve(toNumber(trim(stdout.toString())))
        })
      } else {
        const cmd = `dir ${filepath} /s /b /a-d | find /v /c ""`
        exec(cmd, (error: Error, stdout: string, stderr: string) => {
          if (!!stderr) {
            resolve(0)
          }
          resolve(toNumber(trim(stdout.toString())))
        })
      }
    } else {
      resolve(1)
    }
  })
}

// 同步获取文件大小
export async function fileSize(
  filepath,
  hasUnit = false
): Promise<number | string> {
  return new Promise((resolve, reject) => {
    if (!!filepath) {
      try {
        fsExit(filepath)
        if (remote.process.platform === 'darwin') {
          const realFilepath = filepath.replace(/\s/g, '\\ ')
          const cmd = `du ${hasUnit ? '-sh' : '-s -k'} ${realFilepath}`
          exec(cmd, (error: Error, stdout: string, stderr: string) => {
            if (!!stderr) {
              resolve(1)
            }
            const detail = stdout.toString().split('/')[0]
            resolve(hasUnit ? trim(detail) : ceil(trim(detail) as any))
          })
        } else {
          const duPath = path.resolve(
            remote.app.isPackaged ? remote.process.resourcesPath : '../',
            './extraResources/du.exe'
          )
          const cmd = `${duPath} -u "${filepath}" /accepteula`
          exec(cmd, (error: Error, stdout: string, stderr: string) => {
            let size: number | string = 0
            if (!!stderr) {
              size = 1
            }
            let detail: any = stdout
              .toString()
              .match(/Size\:\s+((\d+,)*\d+) byte/)
            if (detail && detail.length > 0) {
              detail = detail[1]
              const totalB = detail.replace(/\,/g, '') * 1 || 1
              const totalK = (totalB / 1024).toFixed(0)
              if (!hasUnit) {
                // tslint:disable-next-line: radix
                size = totalK
              } else {
                const totalM = (totalB / 1024 / 1024).toFixed(1)
                // tslint:disable-next-line: radix
                const totalG = (totalB / 1024 / 1024 / 1024).toFixed(1)
                if ((totalG as any) * 1 > 0.1) {
                  size = totalG + 'GB'
                }
                if ((totalM as any) * 1 > 0.1) {
                  size = totalM + 'MB'
                }
                size = totalK + 'KB'
              }
            }
            resolve(size)
          })
        }
      } catch (e) {
        resolve(1)
      }
    } else {
      resolve(1)
    }
  })
}

// 检查存在文件夹
export function fsExit(filePath) {
  return fs.accessSync(filePath || '', fs.constants.F_OK)
}
export function resloveFinder(filePath: string, key) {
  if (!filePath) {
    return
  }
  if (filePath.endsWith(getFileName(key) || '')) {
    remote.shell.showItemInFolder(filePath)
  } else {
    remote.shell.showItemInFolder(path.join(filePath, getFileName(key) || ''))
  }
}
export function openBrowerTo(url) {
  remote.shell.openExternal(url)
}

export function humanizeSize(bytes: number) {
  bytes = bytes * 1
  if (bytes === undefined || bytes === null) {
    return ''
  } else if (bytes < 1024) {
    return `${bytes.toFixed(1)} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  } else {
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
  }
}
export function computeTime(size: number, speed: number | string) {
  if (!speed || !size) {
    return
  }
  let time = 0
  if (typeof speed === 'string') {
    const [, speedValue, unit] = speed.match(
      /([0-9]\d*\.*\d*|0\.*\d*[1-9]\d)(MB\/s|KB\/s|kB\/s)/
    )
    if (!toNumber(speedValue)) {
      return '0 秒'
    }
    if (unit === 'B/s') {
      time = (size / toNumber(speedValue)) * 1024
    } else if (unit === 'kB/s') {
      time = size / toNumber(speedValue)
    } else if (unit === 'MB/s') {
      time = size / toNumber(speedValue) / 1024
    } else if (unit === 'GB/s') {
      time = size / toNumber(speedValue) / 1024 / 1024
    }
    return moment.duration(time, 'seconds').locale('zh-cn').humanize()
  }
  if (typeof speed === 'number') {
    time = size / toNumber(speed)
    return moment.duration(time, 'seconds').locale('zh-cn').humanize()
  }
}
export function getFileName(filePath: string) {
  if (!filePath) {
    return
  }
  if (remote.process.platform === 'darwin') {
    return filePath.split('/')[filePath.split('/').length - 1]
  } else {
    return filePath.split('\\')[filePath.split('\\').length - 1]
  }
}
// 应用重启
export function appRelanch() {
  remote.app.relaunch()
  remote.app.exit(0)
}
// 检查新版本
export function checkVersion() {
  return new Promise((resolve, reject) => {
    const currentVersion = remote.app.getVersion()
    // 获取最新版本号
    downloadVersionFile()
      .then(({ code, message }) => {
        if (code === 200) {
          const originMsg = parse(message)
          if (semver.lt(currentVersion, originMsg.version)) {
            // 开启增量更新
            return resolve({
              status: 'OPEN_PART_UPDATE',
              version: originMsg.version,
              releaseNotes: originMsg.releaseNotes
            })
          } else {
            return resolve({
              status: 'LAST'
            })
          }
        } else {
          return reject()
        }
      })
      .catch((e) => {
        console.error(e)
        reject(e)
      })
  })
}
