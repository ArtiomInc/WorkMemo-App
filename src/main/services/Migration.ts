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
  color?: number
  title?: string
  list?: {
    id: number
    type: number
    color: number
    content: number
  }[]
}

export class Migration {
  protected store: ElectronStore
  protected data: {
    user: any
    todo: any
    note: any
  } = {
    user: null,
    todo: [],
    note: []
  }

  constructor() {
    this.store = new ElectronStore()
  }

  async getOldData(): Promise<any> {
    const fileDirectory = process.env.APPDATA + '/Notes/'
    const fileName = 'data.json'
    try {
      const contenu = await fs.promises.readFile(fileDirectory + fileName, 'utf-8')
      this.data = await JSON.parse(contenu)
      return this.data
    } catch {
      this.store.set('migration', 1)
      throw new Error('migration.error.unable_to_find_old_data')
    }
  }

  async setTodoData(data: Todo[]): Promise<Todo[]> {
    this.store.set('todo', data)
    return this.store.get('todo') as Todo[]
  }

  async setNoteData(data: Note[]): Promise<Note[]> {
    this.store.set('note', data)
    return this.store.get('note') as Note[]
  }

  async getMigrationState(): Promise<number> {
    try {
      return this.store.get('migration') as number
    } catch {
      this.store.set('migration', 0)
      return 0
    }
  }

  async saveMigrationState(state: number): Promise<void> {
    this.store.set('migration', state)
  }
}

export default Migration
