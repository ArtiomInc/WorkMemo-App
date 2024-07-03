import { app, BrowserWindow, ipcMain, session, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'

import { AppManager } from './services/AppManager'
import { Migration } from './services/Migration'
import { NoteManager } from './services/NoteManager'
import { TodoManager } from './services/TodoManager'
import AppCommands from './static/AppCommands'
import NoteCommands from './static/NoteCommands'
import TodoCommands from './static/TodoCommands'

let mainWindow: BrowserWindow
const appManager = new AppManager()
const migration = new Migration()
const todoManager = new TodoManager()
const noteManager = new NoteManager()
const hasLock = app.requestSingleInstanceLock()
const saveTodoInterval = setInterval(todoManager.saveData, 60000)
const saveNoteInterval = setInterval(noteManager.saveData, 60000)

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
      contextIsolation: true
    },
    icon: __dirname + '/static/icon.ico'
  })

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2]
    mainWindow.loadURL(`http://localhost:${rendererPort}`)
  } else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'))
    mainWindow.setMenu(null)
  }

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
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
          'Content-Security-Policy': ["script-src 'self'"]
        }
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
      clearInterval(saveTodoInterval)
      clearInterval(saveNoteInterval)
      todoManager.saveData()
      noteManager.saveData()
      app.quit()
    }
  })

  ipcMain.handle('setCommand', async (event, args) => {
    switch (args[0]) {
      case TodoCommands.GET_DATA:
        return await todoManager.getData()
      case TodoCommands.ADD_NEW_TODO:
        return await todoManager.addNewTodo()
      case TodoCommands.UPDATE_TODO:
        return await todoManager.updateTodo(args[1], args[2])
      case TodoCommands.SHIFT_TODO:
        return await todoManager.shiftTodo(args[1], args[2])
      case TodoCommands.DELETE_TODO:
        return await todoManager.deleteTodo(args[1])
      case TodoCommands.ADD_NEW_GROUP:
        return await todoManager.addGroup()
      case TodoCommands.UPDATE_TITLE_GROUP:
        return await todoManager.updateGroupTitle(args[1], args[2])
      case TodoCommands.ADD_TODO_IN_GROUP:
        return await todoManager.addTodoInGroup(args[1])
      case TodoCommands.UPDATE_TODO_IN_GROUP:
        return await todoManager.updateTodoInGroup(args[1], args[2], args[3])
      case TodoCommands.SHIFT_TODO_IN_GROUP:
        return await todoManager.shiftTodoInGroup(args[1], args[2], args[3])
      case TodoCommands.DELETE_TODO_IN_GROUP:
        return await todoManager.deleteTodoInGroup(args[1], args[2])

      case NoteCommands.GET_NOTE_LIST:
        return await noteManager.getNoteList()
      case NoteCommands.ADD_NEW_NOTE:
        return await noteManager.addNewNote()
      case NoteCommands.GET_NOTE_DETAILS:
        return await noteManager.getNoteDetails(args[1])
      case NoteCommands.UPDATE_NOTE_TITLE:
        return await noteManager.updateNoteTitle(args[1], args[2])
      case NoteCommands.UPDATE_NOTE_CONTENT:
        return await noteManager.updateNoteContent(args[1], args[2])
      case NoteCommands.UPDATE_NOTE_COLOR:
        return await noteManager.updateNoteColor(args[1], args[2])
      case NoteCommands.SHIFT_NOTE:
        return await noteManager.shiftNote(args[1], args[2])
      case NoteCommands.DELETE_NOTE:
        return await noteManager.deleteNote(args[1])

      case AppCommands.GET_THEME:
        return await appManager.getTheme()
      case AppCommands.SAVE_THEME:
        return await appManager.saveTheme(args[1])

      case AppCommands.GET_VERSION:
        return app.getVersion()
      case AppCommands.GET_FILE:
        return await migration.getOldData()
      case AppCommands.GET_MIGRATION_STATE:
        return await migration.getMigrationState()
      case AppCommands.SAVE_MIGRATION_STATE:
        return await migration.saveMigrationState(args[1])
      case AppCommands.MIGRATE_STORE_TODO:
        await migration.setTodoData(args[1])
        await todoManager.initialization()
        return todoManager.getData()
      case AppCommands.MIGRATE_STORE_NOTE:
        await migration.setNoteData(args[1])
        await noteManager.initialization()
        return noteManager.getData()
      case AppCommands.CHECK_BACKUP:
        return await appManager.checkLastSaveStoreDate()
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
