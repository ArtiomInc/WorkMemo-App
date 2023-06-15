import * as fs from "fs";

export interface Todo {
  id: number;
  content: string;
  color: string;
}
export interface Note {
  id: number;
  title: string;
  content: string;
}

export class Orchestrator {
  static data: {
    user: any;
    todo: Todo[];
    note: Note[];
  } = {
    user: null,
    todo: [],
    note: [],
  };

  async getTodo(): Promise<any | null> {
    try {
      return Orchestrator.data.todo;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addTodo(): Promise<void> {
    try {
      console.log(Orchestrator.data);
      Orchestrator.data.todo.push({
        id: Orchestrator.data.todo.length,
        content: "New todo !",
        color: "rgba(0,0,0,0)",
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateTodo(id: number, content: any): Promise<void> {
    try {
      Orchestrator.data.todo[id].id = content.id;
      Orchestrator.data.todo[id].content = content.content;
      Orchestrator.data.todo[id].color = content.color;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateAllTodo(content: any): Promise<void> {
    try {
      Orchestrator.data.todo.forEach((todo, index) => {
        if (content[index]) {
          todo.id = content[index].id;
          todo.content = content[index].content;
          todo.color = content[index].color;
        }
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      Orchestrator.data.todo.splice(id, 1);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getNoteList(): Promise<any | null> {
    try {
      return Orchestrator.data.note.map((item) => item.title);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addNoteList(): Promise<void> {
    try {
      Orchestrator.data.note.push({
        id: Orchestrator.data.note.length,
        title: "New note !",
        content: "<p>There is the content !</p>",
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getNote(id: number): Promise<any | null> {
    try {
      return Orchestrator.data.note[id];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateNoteTitle(id: number, title: string): Promise<void> {
    try {
      Orchestrator.data.note[id].title = title;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateNoteContent(id: number, content: string): Promise<void> {
    try {
      Orchestrator.data.note[id].content = content;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteNote(id: number): Promise<void> {
    try {
      Orchestrator.data.note.splice(id, 1);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async saveData() {
    const fileDirectory = process.env.APPDATA + "/Notes/";
    const fileName = "data.json";
    const dataStringified = JSON.stringify(Orchestrator.data);
    if (!fs.existsSync(fileDirectory)) {
      fs.mkdirSync(fileDirectory, { recursive: true });
    }
    fs.writeFile(fileDirectory + fileName, dataStringified, (erreur) => {
      if (erreur) {
        console.error(
          "Une erreur s'est produite lors de l'écriture du fichier :",
          erreur
        );
      }
    });
  }

  async getData() {
    const fileDirectory = process.env.APPDATA + "/Notes/";
    const fileName = "data.json";
    try {
      fs.readFile(fileDirectory + fileName, "utf-8", (erreur, contenu) => {
        if (erreur) {
          console.error(erreur);
        } else {
          try {
            Orchestrator.data = JSON.parse(contenu);
          } catch (erreurParse) {
            console.error(erreurParse);
          }
        }
      });
    } catch {}
  }
}
