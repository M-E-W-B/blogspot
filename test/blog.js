const chai = require("chai");
const bcrypt = require("bcrypt-nodejs");
const chaiHttp = require("chai-http");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const { MongooseConnect } = require("../utils");

const should = chai.should();
const baseUrl = "/api/v1";

let token;

chai.use(chaiHttp);

function setGlobals() {
  const user = new User({
    name: "Reilly Boyer",
    email: "Aileen82@gmail.com",
    password: bcrypt.hashSync("hell00", bcrypt.genSaltSync(8), null),
    website: "https://alycia.biz",
    about: "Eos velit nulla.",
    image: "https://s3.amazonaws.com/uifaces/faces/twitter/jwalter14/128.jpg",
    gender: "FEMALE"
  });

  return user
    .save()
    .then(user => {
      return chai
        .request(app)
        .post(baseUrl + "/login")
        .send({
          email: "Aileen82@gmail.com",
          password: "hell00"
        });
    })
    .catch(err => {
      throw err;
    });
}

describe("Blog Routes", () => {
  before(function(done) {
    MongooseConnect.open()
      .then(() => {
        setGlobals()
          .then(res => {
            token = res.body.token;
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  beforeEach(done => {
    Blog.remove({}, err => {
      done();
    });
  });

  describe("GET /blog", () => {
    it("it should GET all the blogs", done => {
      chai
        .request(app)
        .get(baseUrl + "/blog")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("POST /blog", () => {
    it("it should not POST a blog without name field", done => {
      const blog = {
        subdomain: "papercupplastic",
        description:
          "My attention that I have a common form of synesthesia known as grapheme to color synesthesia. It is according to Wikipedia....who are always right...right?"
      };
      chai
        .request(app)
        .post(baseUrl + "/blog")
        .set("x-access-token", token)
        .send(blog)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("name");
          res.body.errors.name.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should not POST a blog without subdomain field", done => {
      const blog = {
        name: "The Synesthesia Project",
        description:
          "My attention that I have a common form of synesthesia known as grapheme to color synesthesia. It is according to Wikipedia....who are always right...right?"
      };
      chai
        .request(app)
        .post(baseUrl + "/blog")
        .set("x-access-token", token)
        .send(blog)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("subdomain");
          res.body.errors.subdomain.should.have
            .property("kind")
            .eql("required");
          done();
        });
    });
    it("it should POST a blog ", done => {
      const blog = {
        name: "The Synesthesia Project",
        subdomain: "papercupplastic",
        description:
          "My attention that I have a common form of synesthesia known as grapheme to color synesthesia. It is according to Wikipedia....who are always right...right?"
      };
      chai
        .request(app)
        .post(baseUrl + "/blog")
        .set("x-access-token", token)
        .send(blog)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name");
          res.body.should.have.property("subdomain");
          res.body.should.have.property("description");
          res.body.should.have.property("status").eql("ACTIVE");
          done();
        });
    });
  });
  describe("GET /blog/:id", () => {
    it("it should GET a blog by the given id", done => {
      const blog = new Blog({
        name: "The Synesthesia Project",
        subdomain: "papercupplastic",
        description:
          "My attention that I have a common form of synesthesia known as grapheme to color synesthesia. It is according to Wikipedia....who are always right...right?",
        status: "INACTIVE"
      });
      blog.save((err, blog) => {
        chai
          .request(app)
          .get(baseUrl + "/blog/" + blog.id)
          .set("x-access-token", token)
          .send(blog)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("name");
            res.body.should.have.property("subdomain");
            res.body.should.have.property("description");
            res.body.should.have.property("status").eql("INACTIVE");
            res.body.should.have.property("_id").eql(blog.id);
            done();
          });
      });
    });
  });
  describe("PUT /blog/:id/status/:status", () => {
    it("it should UPDATE status of a blog", done => {
      const blog = new Blog({
        name: "The Synesthesia Project",
        subdomain: "papercupplastic",
        description:
          "My attention that I have a common form of synesthesia known as grapheme to color synesthesia. It is according to Wikipedia....who are always right...right?",
        status: "INACTIVE"
      });
      blog.save((err, blog) => {
        chai
          .request(app)
          .put(baseUrl + "/blog/" + blog.id + "/status/ACTIVE")
          .set("x-access-token", token)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("status").eql("ACTIVE");
            done();
          });
      });
    });
  });
  describe("PUT /blog/:id", () => {
    it("it should UPDATE a blog given the id", done => {
      const blog = new Blog({
        name: "The Synesthesia Project",
        subdomain: "papercupplastic",
        description:
          "My attention that I have a common form of synesthesia known as grapheme to color synesthesia. It is according to Wikipedia....who are always right...right?",
        status: "INACTIVE"
      });
      blog.save((err, blog) => {
        chai
          .request(app)
          .put(baseUrl + "/blog/" + blog.id)
          .set("x-access-token", token)
          .send({
            description: "No description."
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("description").eql("No description.");
            done();
          });
      });
    });
  });
  describe("DELETE /blog/:id", () => {
    it("it should DELETE a blog given the id", done => {
      const blog = new Blog({
        name: "The Synesthesia Project",
        subdomain: "papercupplastic",
        description:
          "My attention that I have a common form of synesthesia known as grapheme to color synesthesia. It is according to Wikipedia....who are always right...right?",
        status: "INACTIVE"
      });
      blog.save((err, blog) => {
        chai
          .request(app)
          .delete(baseUrl + "/blog/" + blog.id)
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
