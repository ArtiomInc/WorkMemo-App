import ElectronStore from 'electron-store'

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
    content: string
  }[]
}

export class TodoManager {
  protected store: ElectronStore
  private todos: Todo[]
  private maxRandomID: number

  constructor() {
    this.store = new ElectronStore()
    this.todos = this.store.get('todo') as Todo[]
    this.maxRandomID = 100_000
  }

  async initialization(): Promise<void> {
    this.todos = this.store.get('todo') as Todo[]
  }

  async getData(): Promise<Todo[] | undefined> {
    if (this.todos) {
      return this.todos
    } else if (this.todos === undefined) {
      return undefined
    } else {
      throw new Error('todo.error.unable_to_get_todo_data')
    }
  }

  async saveData(): Promise<void> {
    if (this.todos !== undefined) {
      this.store.set('todo', this.todos)
    }
  }

  async addNewTodo(): Promise<void> {
    try {
      this.todos.push({
        id: Math.floor(Math.random() * this.maxRandomID),
        type: 8,
        content: 'New todo !',
        color: 0,
      })
    } catch {
      throw new Error('todo.error.unable_to_add_todo')
    }
  }

  async updateTodo(id: number, todo: Todo): Promise<void> {
    try {
      this.todos[id].content = todo.content
      this.todos[id].color = todo.color
    } catch {
      throw new Error('todo.error.unable_to_update_todo')
    }
  }

  async shiftTodo(id: number, content: string): Promise<void> {
    try {
      if ((id == 0 && content === 'up') || (id == this.todos.length - 1 && content === 'down')) {
        throw new Error('todo.error.unable_to_shift_todo')
      } else {
        if (content === 'up') {
          const temp = this.todos[id]
          this.todos[id] = this.todos[id - 1]
          this.todos[id - 1] = temp
        } else if (content === 'down') {
          const temp = this.todos[id]
          this.todos[id] = this.todos[id + 1]
          this.todos[id + 1] = temp
        }
      }
    } catch {
      throw new Error('todo.error.unable_to_shift_todo')
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      this.todos.splice(id, 1)
    } catch {
      throw new Error('todo.error.unable_to_delete_todo')
    }
  }

  async addGroup(): Promise<void> {
    try {
      this.todos.push({
        id: Math.floor(Math.random() * this.maxRandomID),
        type: 32,
        title: 'New todo group !',
        color: 0,
        list: [],
      })
    } catch {
      throw new Error('todo.error.unable_to_add_todo_in_group')
    }
  }

  async updateGroupTitle(id: number, title: string): Promise<void> {
    try {
      this.todos[id].title = title
    } catch {
      throw new Error('todo.error.unable_to_update_group_title')
    }
  }

  async addTodoInGroup(id: number): Promise<void> {
    try {
      if (this.todos[id].list !== undefined) {
        this.todos[id]?.list?.push({
          id: Math.floor(Math.random() * this.maxRandomID),
          type: 8,
          content: 'New todo in group !',
          color: 0,
        })
      } else {
        throw new Error('todo.error.unable_to_add_todo_in_group')
      }
    } catch {
      throw new Error('todo.error.unable_to_add_todo_in_group')
    }
  }

  async updateTodoInGroup(id: number, sub_id: number, content: any): Promise<void> {
    try {
      if (this.todos[id]) {
        //@ts-expect-error: Should expect undefined
        this.todos[id].list[sub_id] = content
      } else {
        throw new Error('todo.error.unable_to_update_todo_in_group')
      }
    } catch {
      throw new Error('todo.error.unable_to_update_todo_in_group')
    }
  }

  async shiftTodoInGroup(id: number, sub_id: number, content: string): Promise<void> {
    if (this.todos[id].list !== undefined) {
      if (
        id == -1 ||
        (sub_id == 0 && content === 'up') ||
        (sub_id == this.todos[id].list.length - 1 && content === 'down')
      ) {
        throw new Error('todo.error.unable_to_shift_todo_in_group')
      } else {
        if (content === 'up') {
          const temp = this.todos[id].list[sub_id]
          this.todos[id].list[sub_id] = this.todos[id].list[sub_id - 1]
          this.todos[id].list[sub_id - 1] = temp
        } else if (content === 'down') {
          const temp = this.todos[id].list[sub_id]
          this.todos[id].list[sub_id] = this.todos[id].list[sub_id + 1]
          this.todos[id].list[sub_id + 1] = temp
        }
      }
    } else {
      throw new Error('todo.error.unable_to_shift_todo_in_group')
    }
  }

  async deleteTodoInGroup(id: number, sub_id: number): Promise<void> {
    if (this.todos[id] !== undefined) {
      try {
        this.todos[id]?.list?.splice(sub_id, 1)
      } catch {
        throw new Error('todo.error.unable_to_delete_todo_in_group')
      }
    } else {
      throw new Error('todo.error.unable_to_delete_todo_in_group')
    }
  }
}

export default TodoManager
