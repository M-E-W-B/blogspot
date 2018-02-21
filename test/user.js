const chai = require("chai");
const bcrypt = require("bcrypt-nodejs");
const chaiHttp = require("chai-http");
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

describe("User Routes", () => {
  before(function(done) {
    MongooseConnect.open()
      .then(() => {
        setToken(done);
      })
      .catch(done);
  });
  beforeEach(done => {
    User.remove({}, err => {
      done();
    });
  });

  describe("GET /user", () => {
    it("it should GET all the users", done => {
      chai
        .request(app)
        .get(baseUrl + "/user")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("GET /user/:id", () => {
    it("it should GET a user by the given id", done => {
      const user = new User({
        name: "Reilly Boyer",
        email: "Aileen82@gmail.com",
        password: bcrypt.hashSync("hell00", bcrypt.genSaltSync(8), null),
        website: "https://alycia.biz",
        about: "Eos velit nulla.",
        image:
          "https://s3.amazonaws.com/uifaces/faces/twitter/jwalter14/128.jpg",
        gender: "FEMALE"
      });
      user.save((err, user) => {
        chai
          .request(app)
          .get(baseUrl + "/user/" + user.id)
          .set("x-access-token", token)
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("name").eql(user.name);
            res.body.should.have.property("email").eql(user.email);
            res.body.should.have.property("gender").eql(user.gender);
            res.body.should.have.property("_id").eql(user.id);
            done();
          });
      });
    });
  });
  describe("PUT /user/:id", () => {
    it("it should UPDATE a user given the id", done => {
      const user = new User({
        name: "Reilly Boyer",
        email: "Aileen82@gmail.com",
        password: bcrypt.hashSync("hell00", bcrypt.genSaltSync(8), null),
        website: "https://alycia.biz",
        about: "Eos velit nulla.",
        image:
          "https://s3.amazonaws.com/uifaces/faces/twitter/jwalter14/128.jpg",
        gender: "FEMALE"
      });
      user.save((err, user) => {
        chai
          .request(app)
          .put(baseUrl + "/user/" + user.id)
          .set("x-access-token", token)
          .send({
            name: "John Dee",
            website: "https://gohome.in",
            gender: "FEMALE"
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("name").eql("John Dee");
            res.body.should.have.property("website").eql("https://gohome.in");
            res.body.should.have.property("gender").eql("FEMALE");
            done();
          });
      });
    });
  });
  describe("DELETE /user/:id", () => {
    it("it should DELETE a user given the id", done => {
      const user = new User({
        name: "Reilly Boyer",
        email: "Aileen82@gmail.com",
        password: bcrypt.hashSync("hell00", bcrypt.genSaltSync(8), null),
        website: "https://alycia.biz",
        about: "Eos velit nulla.",
        image:
          "https://s3.amazonaws.com/uifaces/faces/twitter/jwalter14/128.jpg",
        gender: "FEMALE"
      });
      user.save((err, user) => {
        chai
          .request(app)
          .delete(baseUrl + "/user/" + user.id)
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
