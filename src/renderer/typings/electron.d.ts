/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  setCommand: (args: [...args: any]) => Promise<any>
}

declare global {
  interface Window {
    electronAPI: ElectronApi
  }
}
