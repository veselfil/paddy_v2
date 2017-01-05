const WindowManager = require("./window-manager")
const {app, ipcMain} = require("electron")
const url = require("url")
const path = require("path")
const {FileManager, File} = require("./file-manager")
const {FileManipulationHandler} = require("./file-manipulation-handler")

class Paddy {
    constructor () {
        this.fileManipHandler = new FileManipulationHandler(this)
        this.fileManager = new FileManager()
        this.currentFile = null
    }

    init () {
        let urlParam = url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file",
            slashes : "true"
        })

        this.winManager = new WindowManager(800, 600, "Paddy v2", true, urlParam)
    }

    updateTextfield () {
        if(this.currentFile != null)
          this.winManager.sendData("open-file", {"fileContent": this.currentFile.content})
        else this.winManager.sendData("open-file", {"fileContent": ""})
    }
}

module.exports = Paddy
