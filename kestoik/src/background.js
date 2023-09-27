'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog, Notification } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const path = require('path');
const fs = require('fs');
const isDevelopment = process.env.NODE_ENV === 'production'

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
    roundedCorners: true,
    hasShadow: true,
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
      if (err) {
        fs.writeFile(filePath, '{"days":[], "campaigns":[]}', () => {});
      }
      else {
        const dayList = JSON.parse(data)['days'];
        const matchingDay = dayList.find(item => !item.finalized);

        win.webContents.send('get-today-response', matchingDay || null);
      }
    });
  });
  ipcMain.on('get-campaign', (event, campaignName) => {
    const filePath = path.join(__dirname, '../src/assets', 'data.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        fs.writeFile(filePath, '{"days":[], "campaigns":[]}', () => {});
      }
      else {
        const campaignsList = JSON.parse(data)['campaigns'];
        const matchingCampaign = campaignsList.find(item => item.name == campaignName);

        win.webContents.send('get-campaign-response', matchingCampaign || null);
      }
    });
  });
  ipcMain.on('get-days', (event) => {
    const filePath = path.join(__dirname, '../src/assets', 'data.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        fs.writeFile(filePath, '{"days":[], "campaigns":[]}', () => {});
      }
      else {
        const dayList = JSON.parse(data)['days'];
        win.webContents.send('get-days-response', dayList);
      }
    });
  });
  ipcMain.on('get-campaigns', (event) => {
    const filePath = path.join(__dirname, '../src/assets', 'data.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        fs.writeFile(filePath, '{"days":[], "campaigns":[]}', () => {});
      }
      else {
        const campaignsList = JSON.parse(data)['campaigns'];
        win.webContents.send('get-campaigns-response', campaignsList || null);
      }
    });
  });
  ipcMain.on('save-today', (event, dayToSave) => {
    const filePath = path.join(__dirname, '../src/assets', 'data.json');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        fs.writeFile(filePath, '{"days":[], "campaigns":[]}', () => {});
      }
      else {
        let totalData = JSON.parse(data)
        const index = totalData['days'].findIndex(item => !item.finalized);

        if (index !== -1) {
          totalData['days'][index] = dayToSave;
        }
        else {
          totalData['days'].push(dayToSave);
        }
        if (dayToSave.finalized) {
          new Notification({
            title: 'JSON DATA',
            body: JSON.stringify(totalData['days'])
          }).show()
          fs.writeFile(filePath, JSON.stringify(totalData), ()=>{});
          win.close()
        }
        fs.writeFile(filePath, JSON.stringify(totalData), ()=>{});
      }
    });
  });
  ipcMain.on('save-campaigns', (event, campaignsToSave) => {
    const filePath = path.join(__dirname, '../src/assets', 'data.json');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        fs.writeFile(filePath, '{"days":[], "campaigns":[]}', () => {});
      }
      else {
        let totalData = JSON.parse(data)
        console.log(totalData['campaigns'])
        totalData['campaigns'] = campaignsToSave
        console.log(totalData['campaigns'])
        fs.writeFile(filePath, JSON.stringify(totalData), ()=>{});
      }
    });
  });
  ipcMain.on('close-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
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
        fs.writeFile(filePath, md.join('\n'), () => {});
      } 
      else {
        fs.writeFile(filePath, md.join('\n'), () => {});
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
app.isPackaged