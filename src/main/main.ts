import { app, BrowserWindow, ipcMain, session } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'

import { Migration } from './services/Migration'
// import { NoteManager } from './services/NoteManager'
// import { TodoManager } from './services/TodoManager'
import AppCommands from './static/AppCommands'

let mainWindow: BrowserWindow
const migration = new Migration()
// const todoManager = new TodoManager()
// const noteManager = new NoteManager()
const hasLock = app.requestSingleInstanceLock()

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    //fullscreen: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: __dirname + '/static/icon.ico',
  })

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2]
    mainWindow.loadURL(`http://localhost:${rendererPort}`)
  } else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'))
    mainWindow.setMenu(null)
  }
}

if (!hasLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    createWindow()

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ["script-src 'self'"],
        },
      })
    })

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })

    autoUpdater.checkForUpdates()
    if (mainWindow) console.log(`Checking for updates. Current version ${app.getVersion()}`)
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  ipcMain.handle('setCommand', async (event, args) => {
    switch (args[0]) {
      // case TodoCommands.GET_LIST_TODO:
      //   return await todoManager.getData()
      // case TodoCommands.ADD_NEW_TODO:
      //   return await todoManager.addNewTodo()
      // case TodoCommands.UPDATE_TODO:
      //   return await orchestrator.updateTodo(args[1], args[2])
      // case TodoCommands.SHIT_TODO:
      //   return await orchestrator.shiftTodo(args[1], args[2])
      // case TodoCommands.DELETE_TODO:
      //   return await orchestrator.deleteTodo(args[1])
      // case TodoCommands.ADD_NEW_GROUP:
      //   return await orchestrator.addTodoGroup()
      // case TodoCommands.DELETE_GROUP:
      //   return await orchestrator.deleteTodoGroup(args[1])
      // case TodoCommands.UPDATE_TITLE_GROUP:
      //   return await orchestrator.updateTodoGroupTitle(args[1], args[2])
      // case TodoCommands.ADD_TODO_IN_GROUP:
      //   return await orchestrator.addTodoGroupTodo(args[1])
      // case TodoCommands.SHIFT_TODO_IN_GROUP:
      //   return await orchestrator.shiftTodoGroupTodo(args[1], args[2], args[3])
      // case TodoCommands.UPDATE_TODO_IN_GROUP:
      //   return await orchestrator.updateTodoGroupTodo(args[1], args[2], args[3])
      // case TodoCommands.DELETE_TODO_IN_GROUP:
      //   return await orchestrator.deleteTodoGroupTodo(args[1], args[2])
      // case NoteCommands.GET_LIST_NOTE:
      //   return await orchestrator.getNoteList()
      // case NoteCommands.ADD_NEW_NOTE:
      //   return await orchestrator.addNoteList()
      // case NoteCommands.GET_DETAILS_NOTE:
      //   return await orchestrator.getNote(args[1])
      // case NoteCommands.UPDATE_TITLE_NOTE:
      //   return await orchestrator.updateNoteTitle(args[1], args[2])
      // case NoteCommands.UPDATE_CONTENT_NOTE:
      //   return await orchestrator.updateNoteContent(args[1], args[2])
      // case NoteCommands.UPDATE_COLOR_NOTE:
      //   return await orchestrator.updateNoteColor(args[1], args[2])
      // case NoteCommands.SHIT_NOTE:
      //   return await orchestrator.shiftNote(args[1], args[2])
      // case NoteCommands.DELETE_NOTE:
      //   return await orchestrator.deleteNote(args[1])
      // case AppCommands.GET_THEME:
      //   return await orchestrator.getTheme()
      // case AppCommands.SAVE_THEME:
      //   return await orchestrator.saveTheme(args[1])
      case AppCommands.GET_VERSION:
        return app.getVersion()
      case AppCommands.GET_FILE:
        return migration.getOldData()
      case AppCommands.MIGRATE_STORE_TODO:
        return migration.setTodoData(args[1])
      case AppCommands.MIGRATE_STORE_NOTE:
        return migration.setNoteData(args[1])
      default:
        throw new Error('main.error.command_not_exist')
    }
  })
}

/* New Update Available */
autoUpdater.on('update-available', (info) => {
  console.log(info)
  if (mainWindow) console.log(`Update available. Current version ${app.getVersion()}`)
  autoUpdater.downloadUpdate()
})

autoUpdater.on('update-not-available', (info) => {
  console.log(info)
  if (mainWindow) console.log(`No update available. Current version ${app.getVersion()}`)
})

/* Download Completion Message */
autoUpdater.on('update-downloaded', (info) => {
  console.log(info)
  if (mainWindow) console.log(`Update downloaded. Current version ${app.getVersion()}`)
})

autoUpdater.on('error', (info) => {
  console.error(info)
})
