'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const path = require('path');
const fs = require('fs');
const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let win

async function createWindow() {
  const preloadFilePath = path.join(__dirname, '../src', 'preload.js');
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: preloadFilePath,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  ipcMain.on('get-today', (event) => {
    const filePath = path.join(__dirname, '../src/assets', 'data.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      const dayList = JSON.parse(data);
      const matchingDay = dayList.find(item => !item.finalized);

      win.webContents.send('get-today-response', matchingDay || null);
    });
  });
  ipcMain.on('save-today', (event, dayToSave) => {
    const filePath = path.join(__dirname, '../src/assets', 'data.json');
    fs.readFile(filePath, (err, data) => {
      let dayList = JSON.parse(data);
      const index = dayList.findIndex(item => !item.finalized);

      if (index !== -1) {
        dayList[index] = dayToSave;
      }
      else {
        dayList.push(dayToSave);
      }
      fs.writeFile(filePath, JSON.stringify(dayList), ()=>{});
      if (dayToSave.finalized) {
          win.close();
          app.quit()
      }
    });
  });
  ipcMain.on('close-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.close();
      app.quit()
    }
  });

  ipcMain.on('minimize-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.minimize();
    }
  });

  ipcMain.on('expand-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  });
  ipcMain.on('save-day-file', (event, md) => {

    const fileName = md[0].slice(2).replace(/\//g, '-') + '.md';
    const desktopPath = require('os').homedir() + '/Desktop';
  
    const filePath = path.join(desktopPath, fileName);
  
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile(filePath, md.join('\n'), (writeErr) => {});
      } 
      else {
        fs.writeFile(filePath, md.join('\n'), (writeErr) => {});
      }
    });
  });
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
