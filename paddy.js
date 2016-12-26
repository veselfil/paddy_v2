const WindowManager = require("./window-manager")
const {app, ipcMain} = require("electron")
const url = require("url")
const path = require("path")
const {FileManager, File} = require("./file-manager")

class Paddy {
  constructor() {
    this.fileManager = new FileManager()
    this.currentFile = new File("untitled")
  }

  init() {
    let urlParam = url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file",
      slashes: "true"
    })

    this.winManager = new WindowManager(800, 600, "Paddy v2", true, urlParam)
  }
}

module.exports = Paddy
