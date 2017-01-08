/**
 * Created by vesel on 08.01.2017.
 */
const {dialog} = require("electron")

module.exports = {
    showConfirmationDialog: (title, message, parent = null) => {
        if (parent == null) {
            return dialog.showMessageBox({
                    type   : "question",
                    buttons: ["Yes", "No"],
                    message: message,
                    title  : title
                }) == 0
        }
        else {
            return dialog.showMessageBox(parent, {
                    type   : "question",
                    buttons: ["Yes", "No"],
                    message: message,
                    title  : title
                }) == 0
        }
    },
    showInfoDialog: (title, message, parent = null) => {
        if (parent == null)
            dialog.showMessageBox({
                type   : "info",
                buttons: ["OK"],
                message: message,
                title  : title
            })
        else dialog.showMessageBox(parent, {
            type   : "info",
            buttons: ["OK"],
            message: message,
            title  : title
        })
    }
}
