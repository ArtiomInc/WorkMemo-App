import { app, BrowserWindow, ipcMain, session } from "electron";
import { join } from "path";
import { Orchestrator } from "./services/orchestrator";

const orchestrator = new Orchestrator();
const SaveSometime = setInterval(orchestrator.saveData, 60000);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    //fullscreen: true,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: __dirname + "/static/icon.ico",
  });

  //mainWindow.setMenu(null);

  if (process.env.NODE_ENV === "development") {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else {
    mainWindow.loadFile(join(app.getAppPath(), "renderer", "index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["script-src 'self'"],
      },
    });
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  orchestrator.getData();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    orchestrator.saveData();
    clearInterval(SaveSometime);
    app.quit();
  }
});

ipcMain.handle("setCommand", async (event, args) => {
  try {
    let response = null;
    if (args[0] === "getTodo") {
      response = await orchestrator.getTodo();
    } else if (args[0] === "addTodo") {
      await orchestrator.addTodo();
    } else if (args[0] === "updateTodo") {
      await orchestrator.updateTodo(args[1], args[2]);
    } else if (args[0] === "deleteTodo") {
      await orchestrator.deleteTodo(args[1]);
    } else if (args[0] === "getNoteList") {
      response = await orchestrator.getNoteList();
    } else if (args[0] === "addNoteList") {
      await orchestrator.addNoteList();
    } else if (args[0] === "getNote") {
      response = await orchestrator.getNote(args[1]);
    } else if (args[0] === "updateNoteTitle") {
      await orchestrator.updateNoteTitle(args[1], args[2]);
    } else if (args[0] === "updateNoteContent") {
      await orchestrator.updateNoteContent(args[1], args[2]);
    } else if (args[0] === "deleteNote") {
      await orchestrator.deleteNote(args[1]);
    } else {
      return "Command inexisting";
    }

    return response;
  } catch (error) {
    console.error("Erreur :", error);
    return "Error";
  }
});
