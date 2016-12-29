const fs = require("fs")
const marked = require("marked")
const {dialog} = require("electron")

String.prototype.replaceAll = function(search, replace) {
    if (replace === undefined) {
        return this.toString();
    }
    return this.split(search).join(replace);
}

class File {
    constructor (filename) {
        this.fileName = filename
        this.path = ""
        this.content = ""
    }

    /**
     * Open an existing file using a FileManager
     * @param fileManager FileManager used to load the file from disk.
     * @returns File A File object.
     */
    static open (fileManager) {
        let resultPath = dialog.showOpenDialog({
            title      : "Open a file",
            buttonLabel: "Open",
            properties : ["openFile"]
        })

        if (resultPath == undefined)
            return null

        console.log(resultPath[0])

        return fileManager.loadFile(resultPath[0])
    }


    /**
     * Creates a saves a new file to the disk.
     * @param fileManager The FileManager used to write the file to the disk
     * @param content The current content of the file. (optional, default: "")
     */
    static save (fileManager, content = "") {
        let resultPath = dialog.showSaveDialog({
            title      : "Save file",
            buttonLabel: "Save",
        })

        if (resultPath == undefined)
            return null

        let file = new File(File.getFilename(resultPath))
        file.path = resultPath
        file.content = content

        fileManager.saveFile(file, true)

        return file
    }

    static getFilename (path) {
        try {
            let pathSegments = path.split("/")
            return pathSegments[pathSegments.length() - 1]
        } catch (ex) {
            return "untitled"
        }
    }
}

class FileManager {
    loadFile (path) {
        let file = new File(File.getFilename(path))
        file.path = path
        file.content = fs.readFileSync(path).toString();

        return file
    }

    /**
     * Writes the contents of the file to the disk.
     * @param file The file to be written. Path and content must be defined.
     * @param parseHTML Option to replace HTML tags for escape sequences. (very basic)
     */
    saveFile (file, parseHTML = false) {
        fs.writeFileSync(file.path, parseHTML
            ? this.parseHTML(file.content) : file.content);
    }

    createFile () {
        let file = new File("untitled")
        file.contents = ""
        file.path = undefined
    }

    parseHTML (htmlContent) {
        let remove = ["<div>"]
        let replaceWithNewline = ["</div>", "<br>", "<br/>"]

        remove.forEach((item) => { htmlContent = htmlContent.replaceAll(item, "") })
        replaceWithNewline.forEach((item) => { htmlContent = htmlContent.replaceAll(item, "\n") })

        console.log(htmlContent)
        return htmlContent
    }

    exportMarkdown(data, path) {
        let htmlTemplate = fs.readFileSync("./export-template.html").toString()
        let exportData = htmlTemplate.replace("{% MARKDOWN_CONTENT %}", marked(data))

        console.log("Exporting to: " + path)

        fs.writeFileSync(path, exportData)
    }
}



module.exports = {
    "File"       : File,
    "FileManager": FileManager
}
