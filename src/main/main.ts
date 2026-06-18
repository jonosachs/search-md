import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "node:path";
import fs from "node:fs";
import squirrelStartup from "electron-squirrel-startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrelStartup) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools (DEV only).
  // mainWindow.webContents.openDevTools();
};

// Register named request 'get-markdown'
ipcMain.handle("get-markdown", (_event, dir, filename) => {
  const filePath = path.join(dir, filename);
  return fs.readFileSync(filePath, "utf-8");
});

// Allow user to select directory of md files
ipcMain.handle("select-directory", async (_event, default_dir?: string) => {
  if (default_dir) {
    const home = app.getPath("home");
    default_dir = `${home}${default_dir}`;
  }

  let dir = default_dir || undefined;

  // If dir not provided in argument show selector dialog
  if (!dir) {
    const result = await dialog.showOpenDialog({
      title: "Select directory",
      properties: ["openDirectory"],
    });

    if (result.canceled) {
      return null;
    }

    dir = result.filePaths[0];
  }

  let files = await fs.promises.readdir(dir);

  files = files.filter((filename) => filename.toLowerCase().endsWith(".md"));

  if (files.length === 0) {
    console.info("No md files found");
  }

  return { dir, files };
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
