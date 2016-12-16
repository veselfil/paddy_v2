/**
 * Created by vesel on 12.12.2016.
 */

const {ipcRenderer} = require("electron")

window.onload = () => {
    document.getElementById("red").addEventListener("click", () => ipcRenderer.send("quit-application"))
    document.getElementById("orange").addEventListener("click", () => ipcRenderer.send("minimize-application"))
    document.getElementById("green").addEventListener("click", () => ipcRenderer.send("maximize-application"))
}

document.addEventListener("keypress", (e) => {
        ipcRenderer.send("open-dev-tools")
})