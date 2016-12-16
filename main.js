const {app, BrowserWindow, ipcMain} = require("electron")
const path = require("path")
const url = require("url")
const WindowManager = require("./window-manager")

app.on("ready", () => {
    let winManager = new WindowManager(800, 600, "Paddy v2", true,
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file",
            slashes: "true"
        })
    )
})

