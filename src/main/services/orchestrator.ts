import * as fs from 'fs';

export class Orchestrator {
  static data: {
    user: any;
    todo: any;
    note: any;
  } = {
    user: null,
    todo: [],
    note: [],
  };

  async getTodo(): Promise<any | null> {
    try {
      return Orchestrator.data.todo;
    } catch {
      throw new Error('orchestrator.error.unable_to_get_todo_list');
    }
  }

  async addTodo(): Promise<void> {
    try {
      Orchestrator.data.todo.push({
        id: Orchestrator.data.todo.length,
        type: 8,
        content: 'New todo !',
        color: 0,
      });
    } catch {
      throw new Error('orchestrator.error.unable_to_add_todo');
    }
  }

  async addTodoGroup(): Promise<void> {
    try {
      Orchestrator.data.todo.push({
        id: Orchestrator.data.todo.length,
        type: 32,
        title: 'New todo group !',
        color: 0,
        list: [],
      });
      console.log(Orchestrator.data);
    } catch {
      throw new Error('orchestrator.error.unable_to_add_todo_group');
    }
  }

  async updateTodo(id: number, content: any): Promise<void> {
    try {
      Orchestrator.data.todo[id].id = content.id;
      Orchestrator.data.todo[id].content = content.content;
      Orchestrator.data.todo[id].color = content.color;
    } catch {
      throw new Error('orchestrator.error.unable_to_update_todo');
    }
  }

  async shiftTodo(id: number, content: any): Promise<void> {
    try {
      if (
        (id == 0 && content === 'up') ||
        (id == Orchestrator.data.todo.length - 1 && content === 'down')
      ) {
        throw new Error('orchestrator.error.unable_to_shift_todo');
      } else {
        if (content === 'up') {
          const temp = Orchestrator.data.todo[id];
          Orchestrator.data.todo[id] = Orchestrator.data.todo[id - 1];
          Orchestrator.data.todo[id - 1] = temp;
        } else if (content === 'down') {
          const temp = Orchestrator.data.todo[id];
          Orchestrator.data.todo[id] = Orchestrator.data.todo[id + 1];
          Orchestrator.data.todo[id + 1] = temp;
        }
      }
    } catch {
      throw new Error('orchestrator.error.unable_to_shift_todo');
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      Orchestrator.data.todo.splice(id, 1);
    } catch {
      throw new Error('orchestrator.error.unable_to_delete_todo');
    }
  }

  async getNoteList(): Promise<any | null> {
    try {
      return Orchestrator.data.note.map((item: any) => ({
        title: item.title,
        color: item.color,
      }));
    } catch {
      throw new Error('orchestrator.error.unable_to_get_note_list');
    }
  }

  async addNoteList(): Promise<void> {
    try {
      Orchestrator.data.note.push({
        id: Orchestrator.data.note.length,
        title: 'New note !',
        color: 0,
        content: '<p></p>',
      });
    } catch {
      throw new Error('orchestrator.error.unable_to_add_note');
    }
  }

  async getNote(id: number): Promise<any | null> {
    try {
      return Orchestrator.data.note[id];
    } catch {
      throw new Error('orchestrator.error.unable_to_get_note');
    }
  }

  async updateNoteTitle(id: number, title: string): Promise<void> {
    try {
      Orchestrator.data.note[id].title = title;
    } catch {
      throw new Error('orchestrator.error.unable_to_update_note_title');
    }
  }

  async updateNoteColor(id: number, color: string): Promise<void> {
    try {
      Orchestrator.data.note[id].color = color;
    } catch {
      throw new Error('orchestrator.error.unable_to_update_note_color');
    }
  }

  async updateNoteContent(id: number, content: string): Promise<void> {
    try {
      Orchestrator.data.note[id].content = content;
    } catch {
      throw new Error('orchestrator.error.unable_to_update_note_content');
    }
  }

  async shiftNote(id: number, content: any): Promise<void> {
    try {
      if (
        (id == 0 && content === 'up') ||
        (id == Orchestrator.data.note.length - 1 && content === 'down')
      ) {
        throw new Error('orchestrator.error.unable_to_shift_note');
      } else {
        if (content === 'up') {
          const temp = Orchestrator.data.note[id];
          Orchestrator.data.note[id] = Orchestrator.data.note[id - 1];
          Orchestrator.data.note[id - 1] = temp;
        } else if (content === 'down') {
          const temp = Orchestrator.data.note[id];
          Orchestrator.data.note[id] = Orchestrator.data.note[id + 1];
          Orchestrator.data.note[id + 1] = temp;
        }
      }
    } catch {
      throw new Error('orchestrator.error.unable_to_shift_note');
    }
  }

  async deleteNote(id: number): Promise<void> {
    try {
      Orchestrator.data.note.splice(id, 1);
    } catch {
      throw new Error('orchestrator.error.unable_to_delete_note');
    }
  }

  async saveData() {
    const fileDirectory = process.env.APPDATA + '/Notes/';
    const fileName = 'data.json';
    const dataStringified = JSON.stringify(Orchestrator.data);
    if (!fs.existsSync(fileDirectory)) {
      fs.mkdirSync(fileDirectory, { recursive: true });
    }
    fs.writeFile(fileDirectory + fileName, dataStringified, (error) => {
      if (error) {
        throw new Error('orchestrator.error.unable_to_save_data');
      }
    });
  }

  async getData() {
    const fileDirectory = process.env.APPDATA + '/Notes/';
    const fileName = 'data.json';
    try {
      fs.readFile(fileDirectory + fileName, 'utf-8', (error, contenu) => {
        if (error) {
          throw new Error('orchestrator.error.unable_to_find_data');
        } else {
          try {
            Orchestrator.data = JSON.parse(contenu);
          } catch (errorParse) {
            throw new Error('orchestrator.error.unable_to_catch_data');
          }
        }
      });
    } catch {}
  }
}
