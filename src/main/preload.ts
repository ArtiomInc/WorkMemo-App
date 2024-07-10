import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  setCommand: (cmd: string) => {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke('setCommand', cmd)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          try {
            reject(new Error(error.message.split(':')[2].trim()))
          } catch {
            reject(new Error('preload.error.wrong_implementation'))
          }
        })
    })
  },
})
