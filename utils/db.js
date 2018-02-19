const mongoose = require("mongoose");
const Mockgoose = require("mockgoose").Mockgoose;
const config = require("../config");

mongoose.Promise = global.Promise;

const open = () => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === "test") {
      const mockgoose = new Mockgoose(mongoose);

      // @NOTE: https://github.com/Mockgoose/Mockgoose/issues/36
      mockgoose.helper.setDbVersion("3.2.1");
      mockgoose
        .prepareStorage()
        .then(function() {
          mongoose.connect(config.database.test, err => {
            if (err) return reject(err);
            console.log("Connected to 'test' mongodb.");
            resolve();
          });
        })
        .catch(reject);
    } else {
      mongoose.connect(config.database.dev, config.database.options, err => {
        if (err) return reject(err);
        console.log("Connected to 'dev' mongodb.");
        resolve();
      });
    }
  });
};

const close = mongoose.disconnect;

module.exports = { close, open };
