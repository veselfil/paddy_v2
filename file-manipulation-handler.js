const {FileManager, File} = require("./file-manager")
const {ipcMain, dialog} = require("electron")
const dialogs = require("./dialogs")
/**
 * Handles file manipulation requests from the renderer process.
 */
class FileManipulationHandler {

    /**
     * Creates a new FileManipulationHandler with listeners bound to their appropriate channels.
     * @param paddy The current Paddy instance.
     */
    constructor (paddy) {
        this.paddy = paddy
        this.initListeners()
    }

    saveFile (data) {
        if (this.paddy.currentFile === null) {
            this.paddy.currentFile = File.save(this.paddy.fileManager, data.fileContent)
        } else {
            this.paddy.currentFile.content = data.fileContent
            this.paddy.fileManager.saveFile(this.paddy.currentFile, true)
        }
    }

    /**
     * Starts listening on all of the file-manipulation channels.
     */
    initListeners () {
        ipcMain.on("load-file", () => {
            this.paddy.currentFile = File.open(this.paddy.fileManager)
            this.paddy.updateTextfield()
        })

        ipcMain.on("save-file", (event, data) => {
            this.saveFile(data)
            // goddamn all present null checks. worst fucking mistake i've made in this design.
            // could have used a special constant but noooo me be to special for that
            if (this.paddy.currentFile != null)
                this.paddy.currentFile.modified = false
            if (data.closeWindow)
                this.paddy.winManager.closeWindow()
            if (data.clear) {
                this.paddy.currentFile = null
                this.paddy.updateTextfield()
            }
        })

        ipcMain.on("export-file", (event, data) => {
            let resultPath = dialog.showSaveDialog({
                title      : "Choose export location",
                buttonLabel: "Export",
            })

            if (resultPath == undefined)
                return null

            this.paddy.fileManager.exportMarkdown(data.fileContent, resultPath)
        })

        ipcMain.on("close-file", (event) => {
            if (this.paddy.currentFile.modified) {
                if (dialogs.showConfirmationDialog("Warning", "Changes have been made to the file. Would you like to save them?"))
                    this.paddy.winManager.sendData("save-file", {clear: true})
            }
            else {
                this.paddy.currentFile = null
                this.paddy.updateTextfield()
            }
        })

        ipcMain.on("text-modified", (event) => {
            if (this.paddy.currentFile != null)
                this.paddy.currentFile.modified = true
        })
    }
}

module.exports = {"FileManipulationHandler": FileManipulationHandler}
