const { pick } = require("lodash");
const { Rule } = require("../models");
const { assertRule } = require("../utils");

module.exports = router => {
  // create a rule
  router.post("/rule", assertRule("create", "Rule"), (req, res, next) => {
    const obj = pick(req.body, [
      "description",
      "operation",
      "modelname",
      "accessType",
      "groupId",
      "userId"
    ]);

    const rule = new Rule(obj);

    rule
      .save()
      .then(rule => res.json(rule))
      .catch(next);
  });

  // delete a rule
  router.delete(
    "/rule/:id",
    assertRule("delete", "Rule", req => req.params.id),
    (req, res, next) => {
      const ruleId = req.params.id;

      Rule.remove({ _id: ruleId })
        .then(result => res.json(result))
        .catch(next);
    }
  );

  // update a rule
  router.put(
    "/rule/:id",
    assertRule("update", "Rule", req => req.params.id),
    (req, res, next) => {
      const ruleId = req.params.id;
      const options = { new: true };
      const obj = pick(req.body, [
        "description",
        "operation",
        "modelname",
        "accessType",
        "groupId",
        "userId"
      ]);

      Rule.findByIdAndUpdate(ruleId, obj, options)
        .then(rule => res.json(rule))
        .catch(next);
    }
  );

  // rule details
  router.get(
    "/rule/:id",
    assertRule("read", "Rule", req => req.params.id),
    (req, res, next) => {
      const ruleId = req.params.id;

      Rule.findById(ruleId)
        .then(rule => res.json(rule))
        .catch(next);
    }
  );

  // list of rules
  router.get("/rule", assertRule("list", "Rule"), (req, res, next) => {
    Rule.find({})
      .then(rules => res.json(rules))
      .catch(next);
  });
};
