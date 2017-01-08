/**
 * Created by vesel on 12.12.2016.
 */

const {app, BrowserWindow, ipcMain} = require("electron")

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
    constructor (width, height, title, frameless, defaultURL, paddy) {
        this.width = width
        this.height = height
        this.title = title
        this.frameless = frameless
        this.defaultURL = defaultURL
        this.paddy = paddy

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
    initWindow () {
        global_WindowReference = new BrowserWindow({
            width : this.width,
            height: this.height,
            title : this.title,
            frame : !this.frameless,
            show  : false
        })

        global_WindowReference.on("ready-to-show", () => {
            global_WindowReference.show()
        })
        global_WindowReference.loadURL(this.defaultURL)

        /* Call the window close callback if not null. If it returns true, the window can be closed safely. */
        global_WindowReference.on("close", (event) => {
            if (!this.paddy.onWindowClose())
                event.preventDefault()
        })

        global_WindowReference.on("closed", () => {
            global_WindowReference = null
        })

        /*
         * Registers all of the IPC listeners for system buttons (close, minimize and maximize)
         * on their respective channels.
         */
        require("./system-buttons-handling")(global_WindowReference)

        /* Devtools handler */
        ipcMain.on("open-dev-tools", () => {
            global_WindowReference.openDevTools()
        })
    }

    /**
     * @returns Global reference to the Window.
     */
    getWindow () {
        return global_WindowReference
    }

    /**
     * Send an object using the specified IPC channel.
     * @param channel The channel on which to send the object.
     * @param params The object to send on the channel.
     */
    sendData (channel, params = null) {
        if(params == null)
            global_WindowReference.webContents.send(channel)
        else global_WindowReference.webContents.send(channel, params)
    }

    closeWindow () {
        global_WindowReference.close();
    }
}


module.exports = WindowManager
