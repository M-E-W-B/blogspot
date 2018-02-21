const chai = require("chai");
const bcrypt = require("bcrypt-nodejs");
const chaiHttp = require("chai-http");
const Label = require("../models/label");
const User = require("../models/user");
const app = require("../app");
const { MongooseConnect } = require("../utils");

const should = chai.should();
const baseUrl = "/api/v1";

let token;

chai.use(chaiHttp);

function setToken(done) {
  const user = new User({
    name: "Reilly Boyer",
    email: "Aileen82@gmail.com",
    password: bcrypt.hashSync("hell00", bcrypt.genSaltSync(8), null),
    website: "https://alycia.biz",
    about: "Eos velit nulla.",
    image: "https://s3.amazonaws.com/uifaces/faces/twitter/jwalter14/128.jpg",
    gender: "FEMALE"
  });

  user.save((err, user) => {
    chai
      .request(app)
      .post(baseUrl + "/login")
      .send({
        email: "Aileen82@gmail.com",
        password: "hell00"
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });
}

describe("Label Routes", () => {
  before(function(done) {
    MongooseConnect.open()
      .then(() => {
        setToken(done);
      })
      .catch(done);
  });
  beforeEach(done => {
    Label.remove({}, err => {
      done();
    });
  });

  describe("GET /label", () => {
    it("it should GET all the labels", done => {
      chai
        .request(app)
        .get(baseUrl + "/label")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("POST /label", () => {
    it("it should not POST a label without txt field", done => {
      const label = {};
      chai
        .request(app)
        .post(baseUrl + "/label")
        .set("x-access-token", token)
        .send(label)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("txt");
          res.body.errors.txt.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should POST a label ", done => {
      const label = {
        txt: "Poetry"
      };
      chai
        .request(app)
        .post(baseUrl + "/label")
        .set("x-access-token", token)
        .send(label)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("txt").eql("Poetry");
          done();
        });
    });
  });
  describe("GET /label/:id", () => {
    it("it should GET a label by the given id", done => {
      const label = new Label({
        txt: "Poetry"
      });
      label.save((err, label) => {
        chai
          .request(app)
          .get(baseUrl + "/label/" + label.id)
          .set("x-access-token", token)
          .send(label)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("txt").eql("Poetry");
            res.body.should.have.property("_id").eql(label.id);
            done();
          });
      });
    });
  });
  describe("PUT /label/:id", () => {
    it("it should UPDATE a label given the id", done => {
      const label = new Label({
        txt: "Poetry"
      });
      label.save((err, label) => {
        chai
          .request(app)
          .put(baseUrl + "/label/" + label.id)
          .set("x-access-token", token)
          .send({
            txt: "Death"
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("txt").eql("Death");
            done();
          });
      });
    });
  });
  describe("DELETE /label/:id", () => {
    it("it should DELETE a label given the id", done => {
      const label = new Label({
        txt: "Poetry"
      });
      label.save((err, label) => {
        chai
          .request(app)
          .delete(baseUrl + "/label/" + label.id)
          .set("x-access-token", token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("ok").eql(1);
            res.body.should.have.property("n").eql(1);
            done();
          });
      });
    });
  });
});
