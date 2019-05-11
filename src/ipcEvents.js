import { ipcMain, dialog } from 'electron'

export const initIpcEvents = () => {
  ipcMain.on('export-configs', e => {
    const options = {
      title: 'Export Configs',
      defaultPath: 'AwesomeRedisManagerConfigs.json',
      filters: [
        { name: 'JSON Config File', extensions: ['json'] }
      ]
    }
    dialog.showSaveDialog(options, filename => {
      e.sender.send('export-configs', filename)
    })
  })
}
