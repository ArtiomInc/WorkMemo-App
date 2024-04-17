import ElectronStore from 'electron-store'

interface Note {
  id: number
  title: string
  content: string
  color: number
}

export class NoteManager {
  protected store: ElectronStore
  private notes: Note[]
  private maxRandomID: number

  constructor() {
    this.store = new ElectronStore()
    this.notes = this.store.get('note') as Note[]
    console.log('constructor: NoteManager')
    console.log(this.notes)
    this.maxRandomID = 100_000
  }

  initialization() {
    this.notes = this.store.get('note') as Note[]
  }

  async getNoteList(): Promise<any | null> {
    try {
      return this.notes.map((item: Note) => ({
        title: item.title,
        color: item.color,
      }))
    } catch {
      throw new Error('orchestrator.error.unable_to_get_note_list')
    }
  }

  async addNewNote(): Promise<void> {
    try {
      this.notes.push({
        id: Math.floor(Math.random() * this.maxRandomID),
        title: 'New note !',
        color: 0,
        content: '<p></p>',
      })
    } catch {
      throw new Error('orchestrator.error.unable_to_add_new_note')
    }
  }

  async getNoteDetails(id: number): Promise<Note> {
    try {
      return this.notes[id]
    } catch {
      throw new Error('orchestrator.error.unable_to_get_note')
    }
  }

  async updateNoteTitle(id: number, title: string): Promise<void> {
    try {
      this.notes[id].title = title
    } catch {
      throw new Error('orchestrator.error.unable_to_update_note_title')
    }
  }

  async updateNoteContent(id: number, content: string): Promise<void> {
    try {
      this.notes[id].content = content
    } catch {
      throw new Error('orchestrator.error.unable_to_update_note_content')
    }
  }

  async updateNoteColor(id: number, color: number): Promise<void> {
    try {
      this.notes[id].color = color
    } catch {
      throw new Error('orchestrator.error.unable_to_update_note_color')
    }
  }

  async shiftNote(id: number, content: string): Promise<void> {
    try {
      if ((id == 0 && content === 'up') || (id == this.notes.length - 1 && content === 'down')) {
        throw new Error('orchestrator.error.unable_to_shift_note')
      } else {
        if (content === 'up') {
          const temp = this.notes[id]
          this.notes[id] = this.notes[id - 1]
          this.notes[id - 1] = temp
        } else if (content === 'down') {
          const temp = this.notes[id]
          this.notes[id] = this.notes[id + 1]
          this.notes[id + 1] = temp
        }
      }
    } catch {
      throw new Error('orchestrator.error.unable_to_shift_note')
    }
  }

  async deleteNote(id: number): Promise<void> {
    try {
      this.notes.splice(id, 1)
    } catch {
      throw new Error('orchestrator.error.unable_to_delete_note')
    }
  }
}

export default NoteManager
