import ElectronStore from 'electron-store'
import fs from 'fs'
import util from 'util'

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
    try {
      this.store.set('theme', theme)
    } catch {
      throw new Error('app.error.unable_to_save_theme')
    }
  }

  async checkLastSaveStoreDate(): Promise<void> {
    const today = new Date()
    const todayDay = today.getFullYear() + '.' + today.getMonth() + '.' + today.getDate()
    const lastSaveStoreDate = this.store.get('lastSaveStoreDate')
    if (lastSaveStoreDate === undefined) {
      console.log('[💾] backup was never created')
      this.store.set('lastSaveStoreDate', todayDay)
      await this.dailyCopyOfStore()
    } else if (lastSaveStoreDate === todayDay) {
      console.log('[💾] backup already created today')
    } else {
      console.log('[💾] create backup of store')
      await this.dailyCopyOfStore()
    }
  }

  async dailyCopyOfStore(): Promise<void> {
    try {
      const copyFileAsync = util.promisify(fs.copyFile)
      const filePath = this.store.path
      await util.promisify(fs.access)(filePath, fs.constants.F_OK)

      const fileName = filePath.split('/').pop() || ''
      const fileParts = fileName.split('.')
      const fileExt = fileParts.pop()
      const baseName = fileParts.join('.')

      const backupFilePath = `${baseName}.backup.${fileExt}`

      await copyFileAsync(filePath, backupFilePath)
    } catch {
      throw new Error('app.error.unable_to_create_daily_save')
    }
  }
}

export default AppManager
