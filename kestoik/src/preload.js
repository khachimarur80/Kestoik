const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {
    response: (channel, listener) => {
        const onceListener = (event, ...args) => {
          ipcRenderer.removeListener(channel, onceListener);
          listener(...args);
        };
        
        ipcRenderer.on(channel, onceListener);
    },
    getToday: () => ipcRenderer.send('get-today'),
    getDays: () => ipcRenderer.send('get-days'),
    saveToday: (day) => ipcRenderer.send('save-today', day),

    getCampaign: (campaign) => ipcRenderer.send('get-campaign', campaign),
    getCampaigns: () => ipcRenderer.send('get-campaigns'),
    saveCampaigns: (campaigns) => ipcRenderer.send('save-campaigns', campaigns),

    closeWindow: () => ipcRenderer.send('close-window'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    expandWindow: () => ipcRenderer.send('expand-window'),
    saveDayFile: (md) => ipcRenderer.send('save-day-file', md)
})