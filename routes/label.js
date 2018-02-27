const { Label } = require("../models");
const { pick } = require("lodash");
const { assertRule } = require("../utils");

module.exports = router => {
  // create a label
  router.post("/label", (req, res, next) => {
    const obj = pick(req.body, ["txt"]);

    obj.owner = req.decoded._id;

    const label = new Label(obj);

    label
      .save()
      .then(label => res.json(label))
      .catch(next);
  });

  // delete a label
  router.delete(
    "/label/:id",
    assertRule("DELETE", "Label", req => req.params.id),
    (req, res, next) => {
      const labelId = req.params.id;

      Label.remove({ _id: labelId })
        .then(result => res.json(result))
        .catch(next);
    }
  );

  // edit a label
  router.put(
    "/label/:id",
    assertRule("UPDATE", "Label", req => req.params.id),
    (req, res, next) => {
      const labelId = req.params.id;
      const options = { new: true };
      const obj = pick(req.body, ["txt"]);

      obj.updatedAt = Date.now();

      Label.findByIdAndUpdate(labelId, obj, options)
        .then(label => res.json(label))
        .catch(next);
    }
  );

  // get a label
  router.get("/label/:id", (req, res, next) => {
    const labelId = req.params.id;

    Label.findById(labelId)
      .then(label => res.json(label))
      .catch(next);
  });

  // get all the labels (paginated) in the database
  router.get("/label", (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    let scoreObj = {};
    let sortOptions = {};
    let searchOptions = {};

    if (req.query.search) {
      sortOptions = scoreObj = { score: { $meta: "textScore" } };
      searchOptions = {
        $text: {
          $search: req.query.search
        }
      };
    } else if (req.query.sort) {
      sortOptions = { [req.query.sort]: 1 };
    }

    Label.find(searchOptions, scoreObj)
      .sort(sortOptions)
      .skip(limit * page - limit)
      .limit(limit)
      .then(labels => res.json(labels))
      .catch(next);
  });
};
