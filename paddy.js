const WindowManager = require("./window-manager")
const {app, ipcMain} = require("electron")
const url = require("url")
const path = require("path")
const {FileManager, File} = require("./file-manager")
const {FileManipulationHandler} = require("./file-manipulation-handler")
const dialogs = require("./dialogs")

class Paddy {
    constructor (electronApplication) {
        this.app = electronApplication
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

        this.winManager = new WindowManager(800, 600, "Paddy v2", true, urlParam, this)
    }

    updateTextfield () {
        if (this.currentFile != null)
            this.winManager.sendData("open-file", {"fileContent": this.currentFile.content})
        else this.winManager.sendData("open-file", {"fileContent": ""})
    }

    onWindowClose () {
        if (this.currentFile === null)
            return true;
        if (this.currentFile.modified) {
            if (!dialogs.showConfirmationDialog("Warning", "Changes have been made to the file. Would you like to save them?")) {
                return true
            } else {
                this.winManager.sendData("save-file", {clear: false})
                return false;
            }
        } else {
            return true;
        }
    }
}

module.exports = Paddy
