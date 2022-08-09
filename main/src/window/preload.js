// TODO 上下文隔离
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', {
    onPositions: (callback) => ipcRenderer.on('positions', callback),
    export: (params) => ipcRenderer.send('export', params),
    sendDataSource: (params) => ipcRenderer.send('sendDataSource', params),
    getDataSource: (callback) => ipcRenderer.on('getDataSource', callback),
    finishExport: (callback) => ipcRenderer.on('finishExport', callback),
    errorExport: (callback) => ipcRenderer.on('errorExport', callback),
    getReOpen: (params) => ipcRenderer.send('getReOpen', params),
    sendHistoryToRender: (callback) => ipcRenderer.on('sendHistoryToRender', callback),
    getHistory: (callback) => ipcRenderer.on('getHistory', callback),
    sendHistory: (params) => ipcRenderer.send('sendHistory', params),
})
