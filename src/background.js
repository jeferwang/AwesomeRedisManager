'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'

const appName = 'Awesome Redis Manager'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })

function createWindow (options) {
  options = Object.assign({}, { width: 1024, height: 768, initPath: '', title: appName }, options)
  // Create the browser window.
  let win = new BrowserWindow(options)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/${options.initPath}`)
    if (!process.env.IS_TEST) {
      win.webContents.openDevTools()
    }
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL(`app://./index.html#/${options.initPath}`)
    // win.webContents.openDevTools()
  }

  win.on('closed', () => {
    win = null
    options.closedEvents && Object.keys(options.closedEvents).forEach(eName => app.emit(eName, options.closedEvents[eName]))
  })
  return win
}

let mainWindow
let otherWindows = []

function createMainWindow () {
  mainWindow = createWindow({ width: 1024, height: 768, minWidth: 1024, minHeight: 768 })
  mainWindow.on('close', () => {
    // 主窗口关闭的时候，关闭其他窗口
    otherWindows.forEach(ow => ow && !ow.isDestroyed() && ow.close())
    // 初始化数据
    otherWindows = []
    mainWindow = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    // 非MacOS情况下，关闭所有窗口代表关闭程序
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createMainWindow()
})
app.on('createWindow', async (options) => {
  otherWindows.push(createWindow(options))
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
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
