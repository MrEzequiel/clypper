const { app, BrowserWindow } = require('electron')
try {
  require('electron-reloader')(module)
} catch (_) {}

const createWindow = () => {
  const win = new BrowserWindow({
    backgroundColor: '#fff',
    maxWidth: 800,
    maxHeight: 600,
    resizable: true,
    roundedCorners: true,
    icon: './assets/icon.png',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#f3fcfc',
      symbolColor: '#181818'
    },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('./src/index.html')
  // win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
