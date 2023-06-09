/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  setCommand: (
    args: [cmd: string, id?: number, content?: string]
  ) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: ElectronApi;
  }
}
