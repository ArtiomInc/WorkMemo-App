import { app, BrowserWindow, ipcMain, session } from 'electron';
import { join } from 'path';
import { Orchestrator } from './services/orchestrator';
import ipcMainControl from './static/ipcMainControl';

var mainWindow = null;
const hasLock = app.requestSingleInstanceLock();

const orchestrator = new Orchestrator();
const SaveSometime = setInterval(orchestrator.saveData, 60000);

if (!hasLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      //@ts-ignore
      if (mainWindow.isMinimized()) mainWindow.restore();
      //@ts-ignore
      mainWindow.focus();
    }
  });

  function createWindow() {
    //@ts-ignore
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      //fullscreen: true,
      webPreferences: {
        preload: join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
      icon: __dirname + '/static/icon.ico',
    });

    if (process.env.NODE_ENV === 'development') {
      const rendererPort = process.argv[2];
      //@ts-ignore
      mainWindow.loadURL(`http://localhost:${rendererPort}`);
    } else {
      //@ts-ignore
      mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
      //@ts-ignore
      mainWindow.setMenu(null);
    }
  }

  app.whenReady().then(() => {
    createWindow();

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ["script-src 'self'"],
        },
      });
    });

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

    orchestrator.getData();
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      orchestrator.saveData();
      clearInterval(SaveSometime);
      app.quit();
    }
  });

  ipcMain.handle('setCommand', async (event, args) => {
    switch (args[0]) {
      case ipcMainControl.TODO_GET:
        return await orchestrator.getTodo();
      case ipcMainControl.TODO_ADD:
        return await orchestrator.addTodo();
      case ipcMainControl.TODO_UPDATE:
        return await orchestrator.updateTodo(args[1], args[2]);
      case ipcMainControl.TODO_SHIFT:
        return await orchestrator.shiftTodo(args[1], args[2]);
      case ipcMainControl.TODO_DELETE:
        return await orchestrator.deleteTodo(args[1]);

      case ipcMainControl.TODO_GROUP_ADD:
        return await orchestrator.addTodoGroup();
      case ipcMainControl.TODO_GROUP_SHIFT:
        return null;
      case ipcMainControl.TODO_GROUP_DELETE:
        return await orchestrator.deleteTodoGroup(args[1]);
      case ipcMainControl.TODO_GROUP_TODO_ADD:
        return await orchestrator.addTodoGroupTodo(args[1]);
      case ipcMainControl.TODO_GROUP_TODO_SHIFT:
        return await orchestrator.shiftTodoGroupTodo(args[1], args[2], args[3]);
      case ipcMainControl.TODO_GROUP_TODO_UPDATE:
        return await orchestrator.updateTodoGroupTodo(
          args[1],
          args[2],
          args[3]
        );
      case ipcMainControl.TODO_GROUP_TODO_DELETE:
        return await orchestrator.deleteTodoGroupTodo(args[1], args[2]);

      case ipcMainControl.NOTE_GET_LIST:
        return await orchestrator.getNoteList();
      case ipcMainControl.NOTE_ADD:
        return await orchestrator.addNoteList();
      case ipcMainControl.NOTE_GET:
        return await orchestrator.getNote(args[1]);
      case ipcMainControl.NOTE_UPDATE_TITLE:
        return await orchestrator.updateNoteTitle(args[1], args[2]);
      case ipcMainControl.NOTE_UPDATE_CONTENT:
        return await orchestrator.updateNoteContent(args[1], args[2]);
      case ipcMainControl.NOTE_UPDATE_COLOR:
        return await orchestrator.updateNoteColor(args[1], args[2]);
      case ipcMainControl.NOTE_SHIFT:
        return await orchestrator.shiftNote(args[1], args[2]);
      case ipcMainControl.NOTE_DELETE:
        return await orchestrator.deleteNote(args[1]);
      default:
        throw new Error('main.error.command_not_exist');
    }
  });
}
