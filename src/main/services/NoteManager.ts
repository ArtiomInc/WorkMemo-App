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
    this.maxRandomID = 100_000
  }

  async initialization(): Promise<void> {
    this.notes = this.store.get('note') as Note[]
  }

  async getData(): Promise<Note[] | undefined> {
    if (this.notes) {
      return this.notes
    } else if (this.notes == undefined) {
      return undefined
    } else {
      throw new Error('note.error.unable_to_get_note_data')
    }
  }

  async saveData(): Promise<void> {
    if (this.notes !== undefined) {
      this.store.set('note', this.notes)
    }
  }

  async getNoteList(): Promise<{ title: string; color: number }[] | undefined> {
    try {
      if (this.notes) {
        return this.notes.map((item: Note) => ({
          title: item.title,
          color: item.color,
        }))
      }
    } catch {
      throw new Error('note.error.unable_to_get_note_list')
    }
  }

  async addNewNote(): Promise<void> {
    try {
      if (this.notes !== undefined) {
        this.notes.push({
          id: Math.floor(Math.random() * this.maxRandomID),
          title: 'New note !',
          color: 0,
          content: '<p></p>',
        })
      } else {
        this.notes = [
          {
            id: Math.floor(Math.random() * this.maxRandomID),
            title: 'New note !',
            color: 0,
            content: '<p></p>',
          },
        ]
      }
    } catch {
      throw new Error('note.error.unable_to_add_new_note')
    }
  }

  async getNoteDetails(id: number): Promise<Note> {
    try {
      return this.notes[id]
    } catch {
      throw new Error('note.error.unable_to_get_note')
    }
  }

  async updateNoteTitle(id: number, title: string): Promise<void> {
    try {
      this.notes[id].title = title
    } catch {
      throw new Error('note.error.unable_to_update_note_title')
    }
  }

  async updateNoteContent(id: number, content: string): Promise<void> {
    try {
      this.notes[id].content = content
    } catch {
      throw new Error('note.error.unable_to_update_note_content')
    }
  }

  async updateNoteColor(id: number, color: number): Promise<void> {
    try {
      this.notes[id].color = color
    } catch {
      throw new Error('note.error.unable_to_update_note_color')
    }
  }

  async shiftNote(id: number, content: string): Promise<void> {
    try {
      if ((id == 0 && content === 'up') || (id == this.notes.length - 1 && content === 'down')) {
        throw new Error('note.error.unable_to_shift_note')
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
      throw new Error('note.error.unable_to_shift_note')
    }
  }

  async deleteNote(id: number): Promise<void> {
    try {
      this.notes.splice(id, 1)
    } catch {
      throw new Error('note.error.unable_to_delete_note')
    }
  }
}

export default NoteManager
