import ElectronStore from 'electron-store'
import * as fs from 'fs'

interface Note {
  id: number
  title: string
  content: string
  color: number
}

interface Todo {
  id: number
  type: number
  content?: string
  list?: {
    id: number
    type: number
    color: number
    content: number
  }[]
}

export class Migration {
  protected store: any
  static data: {
    user: any
    todo: any
    note: any
  } = {
    user: null,
    todo: [],
    note: [],
  }

  constructor() {
    this.store = new ElectronStore()
  }

  async getOldData(): Promise<any> {
    const fileDirectory = process.env.APPDATA + '/Notes/'
    const fileName = 'data.json'
    try {
      const contenu = await fs.promises.readFile(fileDirectory + fileName, 'utf-8')
      Migration.data = await JSON.parse(contenu)
      return Migration.data
    } catch {
      throw new Error('orchestrator.error.unable_to_find_data')
    }
  }

  setTodoData(data: Todo[]) {
    this.store.set('todo', data)
    return this.store.get('todo')
  }

  setNoteData(data: Note[]) {
    this.store.set('note', data)
    return this.store.get('note')
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

export default Migration
