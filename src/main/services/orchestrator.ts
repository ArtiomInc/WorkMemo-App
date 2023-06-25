import * as fs from "fs";

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
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addTodo(): Promise<void> {
    try {
      Orchestrator.data.todo.push({
        id: Orchestrator.data.todo.length,
        type: 8,
        content: "New todo !",
        color: "rgba(0,0,0,0)",
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addTodoGroup(): Promise<void> {
    try {
      Orchestrator.data.todo.push({
        id: Orchestrator.data.todo.length,
        type: 32,
        title: "New todo group !",
        list: [],
      });
      console.log(Orchestrator.data);
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

  async shiftTodo(id: number, content: any): Promise<void> {
    try {
      if (
        (id == 0 && content === "up") ||
        (id == Orchestrator.data.todo.length - 1 && content === "down")
      ) {
        throw "Command not executable";
      } else {
        if (content === "up") {
          const temp = Orchestrator.data.todo[id];
          Orchestrator.data.todo[id] = Orchestrator.data.todo[id - 1];
          Orchestrator.data.todo[id - 1] = temp;
        } else if (content === "down") {
          const temp = Orchestrator.data.todo[id];
          Orchestrator.data.todo[id] = Orchestrator.data.todo[id + 1];
          Orchestrator.data.todo[id + 1] = temp;
        }
      }
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
        content: "<p></p>",
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

  async shiftNote(id: number, content: any): Promise<void> {
    try {
      if (
        (id == 0 && content === "up") ||
        (id == Orchestrator.data.note.length - 1 && content === "down")
      ) {
        throw "Command not executable";
      } else {
        if (content === "up") {
          const temp = Orchestrator.data.note[id];
          Orchestrator.data.note[id] = Orchestrator.data.note[id - 1];
          Orchestrator.data.note[id - 1] = temp;
        } else if (content === "down") {
          const temp = Orchestrator.data.note[id];
          Orchestrator.data.note[id] = Orchestrator.data.note[id + 1];
          Orchestrator.data.note[id + 1] = temp;
        }
      }
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
