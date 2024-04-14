import { app, BrowserWindow, ipcMain, session } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'

import { Orchestrator } from './services/orchestrator'
import ipcMainControl from './static/ipcMainControl'

let mainWindow: BrowserWindow
const orchestrator = new Orchestrator()
const hasLock = app.requestSingleInstanceLock()
const SaveSometime = setInterval(orchestrator.saveData, 60000)

orchestrator.getData()
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
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
      orchestrator.saveData()
      clearInterval(SaveSometime)
      app.quit()
    }
  })

  ipcMain.handle('setCommand', async (event, args) => {
    switch (args[0]) {
      case ipcMainControl.TODO_GET:
        return await orchestrator.getTodo()
      case ipcMainControl.TODO_ADD:
        return await orchestrator.addTodo()
      case ipcMainControl.TODO_UPDATE:
        return await orchestrator.updateTodo(args[1], args[2])
      case ipcMainControl.TODO_SHIFT:
        return await orchestrator.shiftTodo(args[1], args[2])
      case ipcMainControl.TODO_DELETE:
        return await orchestrator.deleteTodo(args[1])

      case ipcMainControl.TODO_GROUP_ADD:
        return await orchestrator.addTodoGroup()
      case ipcMainControl.TODO_GROUP_SHIFT:
        return null
      case ipcMainControl.TODO_GROUP_DELETE:
        return await orchestrator.deleteTodoGroup(args[1])
      case ipcMainControl.TODO_GROUP_UPDATE_TITLE:
        return await orchestrator.updateTodoGroupTitle(args[1], args[2])
      case ipcMainControl.TODO_GROUP_TODO_ADD:
        return await orchestrator.addTodoGroupTodo(args[1])
      case ipcMainControl.TODO_GROUP_TODO_SHIFT:
        return await orchestrator.shiftTodoGroupTodo(args[1], args[2], args[3])
      case ipcMainControl.TODO_GROUP_TODO_UPDATE:
        return await orchestrator.updateTodoGroupTodo(args[1], args[2], args[3])
      case ipcMainControl.TODO_GROUP_TODO_DELETE:
        return await orchestrator.deleteTodoGroupTodo(args[1], args[2])

      case ipcMainControl.NOTE_GET_LIST:
        return await orchestrator.getNoteList()
      case ipcMainControl.NOTE_ADD:
        return await orchestrator.addNoteList()
      case ipcMainControl.NOTE_GET:
        return await orchestrator.getNote(args[1])
      case ipcMainControl.NOTE_UPDATE_TITLE:
        return await orchestrator.updateNoteTitle(args[1], args[2])
      case ipcMainControl.NOTE_UPDATE_CONTENT:
        return await orchestrator.updateNoteContent(args[1], args[2])
      case ipcMainControl.NOTE_UPDATE_COLOR:
        return await orchestrator.updateNoteColor(args[1], args[2])
      case ipcMainControl.NOTE_SHIFT:
        return await orchestrator.shiftNote(args[1], args[2])
      case ipcMainControl.NOTE_DELETE:
        return await orchestrator.deleteNote(args[1])

      case ipcMainControl.GET_THEME:
        return await orchestrator.getTheme()
      case ipcMainControl.SAVE_THEME:
        return await orchestrator.saveTheme(args[1])

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
