const app = require("./app")
const log = require("./utils/logger")
const config = require("./utils/config")

app.listen(config.PORT, () => {
  log.info(`Server running on port ${config.PORT}`)
})