const Paddy = require("./paddy")
const {app} = require("electron")

let _paddyInstance = new Paddy()

app.on("ready", () => {
  _paddyInstance.init()
})
