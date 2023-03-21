/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import {contextBridge} from 'electron'
import {BrowserWindow, dialog} from '@electron/remote'
import * as fs from 'fs'

contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize() {
    BrowserWindow.getFocusedWindow().minimize()
  },

  toggleMaximize() {
    const win = BrowserWindow.getFocusedWindow()

    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  },

  close() {
    BrowserWindow.getFocusedWindow().close()
  },

  async selectFile() {
    let result = {
      content: '',
      filePath: ''
    }
    const res = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {name: 'Markdown', extensions: ['md', 'markdown']}
      ]
    })
    if (!res.canceled) {
      result.content = readFile(res.filePaths[0]);
      result.filePath = res.filePaths[0];
    } else {
      result = false;
    }
    return result;
  },


  async saveFile(content, filePath) {
    // 如果文件路径为空，则调用另存为
    if (filePath === '') {
      const res = await dialog.showSaveDialog({
        title: '另存为',
        filters: [
          {name: 'Markdown', extensions: ['md', 'markdown']}
        ],
        buttonLabel: '保存'
      })
      if (res.canceled) {
        return false;
      }else {
        filePath = res.filePath;
        const writeFileResult = await writeFile(filePath, content);
        return {
          writeFileResult,
          filePath
        }
      }
    }
    // 保存文件
    return await writeFile(filePath, content);
  },

  async openFile(filePath) {
    return readFile(filePath);
  }
})

// 读取文件
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

// 写入文件
function writeFile(filePath, content) {
  return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, 'utf-8', (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    }
  )
}
