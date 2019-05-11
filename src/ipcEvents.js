import { ipcMain, dialog } from 'electron'

export const initIpcEvents = () => {
  // 导出配置
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
  // 导入配置
  ipcMain.on('import-configs', e => {
    dialog.showOpenDialog(
      {
        properties: ['openFile']
      },
      files => {
        if (files && files.length) {
          e.sender.send('import-configs', files[0])
        }
      }
    )
  })
}
