const {
  app,
  BrowserWindow,
  Menu,
  Tray
} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  hardResetMethod: 'exit'
})

let mainWindow = null
let tray = null

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds()
  const trayBounds = tray.getBounds()

  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return {
    x, y
  }
}

const toggleWindow = () => (
  mainWindow.isVisible() ? mainWindow.hide() : showWindow()
)

const showWindow = () => {
  const position = getWindowPosition()
  const { x, y } = position

  mainWindow.setPosition(x, y, false)
  mainWindow.show()
}

const createTray = () => {
  tray = new Tray(`${path.join(__dirname, 'icon.png')}`)

  tray.on('click', () => {
    toggleWindow()
  })
}


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 440,
    show: false,
    frame: false,
    transparent: true,
    fullscreenable: false,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      backgroundThrottling: false
    }
  })

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  if (isDev) {
    // Open the DevTools.
    // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>')
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => (mainWindow = null))

  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide()
    }
  })
}

app.on('ready', () => {
  createTray()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.dock.hide()

app.on('activate', () => {
  if (mainWindow === null) {
    createTray()
    createWindow()
  }
})
