import * as fs from 'fs'

export class FileCenter {
  public instance: this

  public readFile(filePath: string) {
    const content = fs.readFileSync(filePath)
    console.log(content)
  }
}
