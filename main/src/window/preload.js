// TODO 上下文隔离
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    onPositions: (callback) => ipcRenderer.on('positions', callback)
})
