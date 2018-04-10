const express = require("express");
const bodyParser = require("body-parser");
const responseTime = require("response-time");
const app = express();
const router = express.Router();

app.use(responseTime()); // adds a X-Response-Time header
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use("/api/v1", router);

require("./routes/unauthenticated")(router);
require("./middlewares")(router);
require("./routes")(router);

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "dev") {
    console.error(err.stack);
    res.json({ message: err.message });
  } else res.json(Object.keys(err).length ? err : { message: err.message });
});

module.exports = app;
