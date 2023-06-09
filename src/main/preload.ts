import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  setCommand: (cmd: string) => ipcRenderer.invoke("setCommand", cmd),
});
