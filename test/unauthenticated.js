const chai = require("chai");
const bcrypt = require("bcrypt-nodejs");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const app = require("../app");
const { MongooseConnect } = require("../utils");

const should = chai.should();
const baseUrl = "/api/v1";

chai.use(chaiHttp);

describe("Unauthenticated Routes", () => {
  before(function(done) {
    MongooseConnect.open()
      .then(() => done())
      .catch(done);
  });
  beforeEach(done => {
    User.remove({}, err => {
      done();
    });
  });

  describe("POST /signup", () => {
    it("it should not signup without an email field", done => {
      const user = {
        name: "Reilly Boyer",
        password: "hell00",
        website: "https://alycia.biz",
        about: "Eos velit nulla.",
        image:
          "https://s3.amazonaws.com/uifaces/faces/twitter/jwalter14/128.jpg",
        gender: "FEMALE"
      };
      chai
        .request(app)
        .post(baseUrl + "/signup")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("email");
          res.body.errors.email.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should not signup without a password field", done => {
      const user = {
        name: "Reilly Boyer",
        email: "Aileen82@gmail.com",
        website: "https://alycia.biz",
        about: "Eos velit nulla.",
        image:
          "https://s3.amazonaws.com/uifaces/faces/twitter/jwalter14/128.jpg",
        gender: "FEMALE"
      };
      chai
        .request(app)
        .post(baseUrl + "/signup")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Password is required!");
          done();
        });
    });
    it("it should not signup with an invalid password field", done => {
      const user = {
        name: "Reilly Boyer",
        email: "Aileen82@gmail.com",
        password: "hello",
        website: "https://alycia.biz",
        about: "Eos velit nulla.",
        image:
          "https://s3.amazonaws.com/uifaces/faces/twitter/jwalter14/128.jpg",
        gender: "FEMALE"
      };
      chai
        .request(app)
        .post(baseUrl + "/signup")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Only 6 to 20 character length allowed!");
          done();
        });
    });
    it("it should create a user", done => {
      const user = {
        name: "Reilly Boyer",
        email: "Aileen82@gmail.com",
        password: "hell00",
        website: "https://alycia.biz",
        about: "Eos velit nulla.",
        image:
          "https://s3.amazonaws.com/uifaces/faces/twitter/jwalter14/128.jpg",
        gender: "FEMALE"
      };
      chai
        .request(app)
        .post(baseUrl + "/signup")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name");
          res.body.should.have.property("email");
          res.body.should.have.property("password");
          res.body.should.have.property("website");
          res.body.should.have.property("about");
          res.body.should.have.property("image");
          res.body.should.have.property("gender");
          done();
        });
    });
  });
  describe("POST /login", () => {
    it("it should not login with an invalid email", done => {
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
          .post(baseUrl + "/login")
          .send({
            email: "xxx@abc.com",
            password: "whateverX#^&"
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Authentication failed. User not found.");
            done();
          });
      });
    });
    it("it should not login with an invalid password", done => {
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
          .post(baseUrl + "/login")
          .send({
            email: "Aileen82@gmail.com",
            password: "whateverX#^&"
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Authentication failed. Wrong password.");
            done();
          });
      });
    });
    it("it should login with correct credentials", done => {
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
          .post(baseUrl + "/login")
          .send({
            email: "Aileen82@gmail.com",
            password: "hell00"
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Enjoy your token!");
            res.body.user.should.be.a("object");
            res.body.user.should.have.property("name").eql("Reilly Boyer");
            res.body.user.should.have
              .property("email")
              .eql("Aileen82@gmail.com");
            res.body.should.have.property("token");
            done();
          });
      });
    });
  });
});
