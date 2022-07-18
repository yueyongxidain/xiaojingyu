import * as fs from 'fs'

export class FileCenter {
    public instance: this

    public readFile(filePath: string) {
        const content = fs.readFileSync(filePath, { encoding: 'utf-8' })
        const positions = content.toString().split('\r\n')
        const title = positions.shift()
        const positionOne = positions.shift()
        console.log(title, positionOne.split(','))
        this.sendToRender(positions)
    }

    public sendToRender(positions: any[]) {
        global.mainWindow.webContents.send('positions', positions)
    }
}
