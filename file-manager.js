const fs = require("fs")
const markdown = require("markdown")

class File {
  constructor(filename) {
    this.fileName = filename
    this.path = ""
    this.content = ""
  }
}

class FileManager {
  loadFile(path) {
    let pathSegments = path.split("/")
    let file = new File(pathSegments[pathSegments.length()])
    file.path = path
    file.content = fs.readFileSync(path).toString();

    return file
  }

  saveFile(file) {
    fs.writeFileSync(file.path, file.contents);
  }

  createFile() {
    let file = new File("untitled")
    file.contents = ""
    file.path = undefined
  }
}

module.exports = {
  "File": File,
  "FileManager": FileManager
}
