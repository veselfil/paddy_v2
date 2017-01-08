/**
 * Created by vesel on 12.12.2016.
 */

const {ipcRenderer} = require("electron")

window.onload = () => {
    document.getElementById("red").addEventListener("click", () => ipcRenderer.send("quit-application"))
    document.getElementById("orange").addEventListener("click", () => ipcRenderer.send("minimize-application"))
    document.getElementById("green").addEventListener("click", () => ipcRenderer.send("maximize-application"))

    let textArea = document.querySelector("#editable-content")
    let styler = new Styler()

    // file manipulations
    document.getElementById("save-file-button").addEventListener("click", () => {
        ipcRenderer.send("save-file", {"fileContent": textArea.innerText})
    })

    document.getElementById("load-file-button").addEventListener("click", () => {
        ipcRenderer.send("load-file")
    })

    document.getElementById("export-file-button").addEventListener("click", () => {
        ipcRenderer.send("export-file", {"fileContent": textArea.innerText})
    })

    ipcRenderer.on("open-file", (event, data) => {
        document.querySelector("#editable-content").innerText = data.fileContent
    })

    document.getElementById("close-file-button").addEventListener("click", (event) => {
        ipcRenderer.send("close-file")
    })

    /* Handles TAB characters. */
    document.querySelector("#editable-content").addEventListener("keydown", (e) => {
        if (e.keyCode == 9 || e.which == 9) {
            e.preventDefault();

            let editor = document.getElementById("editable-content");
            let doc = editor.ownerDocument.defaultView;
            let sel = doc.getSelection();
            let range = sel.getRangeAt(0);

            let tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
            range.insertNode(tabNode);

            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    })

    /* Syntax highlighting */
    // document.querySelector("#editable-content").addEventListener("input", (event) => {
    //     let styledText = styler.styleText(textArea.innerHTML)
    //     console.log(styledText)
    //     textArea.innerHTML = styledText
    // })

    document.addEventListener("keydown", (event) => {
        if (event.keyCode == 123)
            ipcRenderer.send("open-dev-tools");
    })
}