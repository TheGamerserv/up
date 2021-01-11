const { app, ipcMain, BrowserWindow } = require("electron");
const path = require("path");
const { Client, Authenticator } = require("minecraft-launcher-core");
const launcher = new Client();
const {autoUpdater} = require ('electron-updater');

let mainWindow;

function createWindow() {

  mainWindow = new BrowserWindow({
    //frame: false,
    title: "The Gamer serv",
    icon: path.join(__dirname, "/asset/icon.ico"),
    width: 1250,
    height: 700,
    minWidth: 1250,
    minHeight: 700,
    maxWidth: 1250,
    maxHeight: 700,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(path.join(__dirname, "app.html"));

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("login", (event, data) => {
  Authenticator.getAuth(data.user, data.pass).then(() => {
    mainWindow.loadURL(path.join(__dirname,"index.html"));
  }).catch(() => {
    event.sender.send("err","Mail et/ou mot de passe incorrect");
  });
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
