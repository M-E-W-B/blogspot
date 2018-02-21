module.exports = router => {
  require("./blog")(router);
  require("./user")(router);
  require("./post")(router);
  require("./label")(router);
  require("./comment")(router);
  require("./user-blog")(router);
  require("./label-post")(router);
};
