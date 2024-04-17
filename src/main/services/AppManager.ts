import ElectronStore from 'electron-store'

export class AppManager {
  protected store: ElectronStore

  constructor() {
    this.store = new ElectronStore()
  }

  async getTheme() {
    try {
      return this.store.get('theme')
    } catch {
      this.store.set('theme', 'light')
      return this.store.get('theme')
    }
  }

  async saveTheme(theme: string) {
    this.store.set('theme', theme)
  }
}

export default AppManager
