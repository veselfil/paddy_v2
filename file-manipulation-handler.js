const {FileManager, File} = require("./file-manager")
const {ipcMain, dialog} = require("electron")

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

    /**
     * Starts listening on all of the file-manipulation channels.
     */
    initListeners () {
        ipcMain.on("load-file", () => {
            this.paddy.currentFile = File.open(this.paddy.fileManager)
            this.paddy.updateTextfield()
        })

        ipcMain.on("save-file", (event, data) => {
            if(this.paddy.currentFile === null) {
                this.paddy.currentFile = File.save(this.paddy.fileManager, data.fileContent)
            } else {
                this.paddy.currentFile.content = data.fileContent
                this.paddy.fileManager.saveFile(this.paddy.currentFile, true)
            }
        })

        ipcMain.on("export-file", (event, data) => {
            let resultPath = dialog.showSaveDialog({
                title: "Choose export location",
                buttonLabel: "Export",
            })

            if(resultPath == undefined)
                return null

            this.paddy.fileManager.exportMarkdown(data.fileContent, resultPath)
        })

        ipcMain.on("close-file", (event) => {
          this.paddy.currentFile = null
          this.paddy.updateTextfield()
          console.log("sumfink")
        })
    }
}

module.exports = {"FileManipulationHandler": FileManipulationHandler}
