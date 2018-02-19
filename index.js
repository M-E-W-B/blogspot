const { MongooseConnect } = require("./utils");
const app = require("./app");

const port = process.env.PORT || 8080;

MongooseConnect.open().then(() => {
  app.listen(port, () => console.log(`Server running @ ${port}`));
});
