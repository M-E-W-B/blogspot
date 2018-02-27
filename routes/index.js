module.exports = router => {
  require("./blog")(router);
  require("./user")(router);
  require("./post")(router);
  require("./label")(router);
  require("./group")(router);
  require("./group-member")(router);
  require("./rule")(router);
  require("./comment")(router);
  require("./user-follow-blog")(router);
  require("./post-label")(router);
};
