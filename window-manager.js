/**
 * Created by vesel on 12.12.2016.
 */

const {app, BrowserWindow} = require("electron")

let global_WindowReference

// note that this implementation only allows for one window to be running on the same process
class WindowManager {

    /**
     * Creates a WindowManager in an usable state with the Window open.
     * @param width
     * @param height
     * @param title
     * @param frameless
     * @param defaultURL
     */
    constructor(width, height, title, frameless, defaultURL) {
        this.width = width
        this.height = height
        this.title = title
        this.frameless = frameless
        this.defaultURL = defaultURL

        this.initWindow()
        app.on("window-all-closed", () => {
            if (!process.platform !== "darwin")
                app.quit()
        })

        app.on("activate", () => {
            if (global_WindowReference === null)
                this.initWindow()
        })
    }

    /**
     * Creates a new window and saves it into the global reference field.
     */
    initWindow() {
        global_WindowReference = new BrowserWindow({
            width: this.width,
            height: this.height,
            title: this.title,
            frame: !this.frameless
        })

        global_WindowReference.loadURL(this.defaultURL)

        // destroy the refernce in case the window is closed
        global_WindowReference.on("closed", () => global_WindowReference = null)
        require("./system-buttons-handling")(global_WindowReference)
    }

    /**
     * @returns Global reference to the Window.
     */
    getWindow() {
        return global_WindowReference
    }
}


module.exports = WindowManager
