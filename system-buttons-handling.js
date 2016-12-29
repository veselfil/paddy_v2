/**
 * Created by vesel on 12.12.2016.
 */

const {ipcMain, app, Window} = require("electron")

module.exports = (window) => {
    let windowMaximized = false

    ipcMain.on("quit-application", () => {
        window.close()
    })

    ipcMain.on("minimize-application", () => {
        window.minimize()
    })

    ipcMain.on("maximize-application", () => {
        if (windowMaximized)
            window.unmaximize()
        else window.maximize()
        windowMaximized = !windowMaximized
    })
}
