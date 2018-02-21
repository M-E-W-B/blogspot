const chai = require("chai");
const bcrypt = require("bcrypt-nodejs");
const chaiHttp = require("chai-http");
const Blog = require("../models/blog");
const Post = require("../models/post");
const User = require("../models/user");
const app = require("../app");
const { MongooseConnect } = require("../utils");

const should = chai.should();
const baseUrl = "/api/v1";

let token;
let blogId;

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

  const blog = new Blog({
    name: "The Synesthesia Project",
    subdomain: "papercupplastic",
    description:
      "My attention that I have a common form of synesthesia known as grapheme to color synesthesia. It is according to Wikipedia....who are always right...right?"
  });

  const tokenPromise = user
    .save()
    .then(user => {
      return chai
        .request(app)
        .post(baseUrl + "/login")
        .send({
          email: "Aileen82@gmail.com",
          password: "hell00"
        })
        .then(res => res.body.token)
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      throw err;
    });

  const blogIdPromise = blog
    .save()
    .then(blog => blog.id)
    .catch(err => {
      throw err;
    });

  return Promise.all([tokenPromise, blogIdPromise]);
}

describe("Post Routes", () => {
  before(function(done) {
    MongooseConnect.open()
      .then(() => {
        setGlobals()
          .then(([tkn, bId]) => {
            token = tkn;
            blogId = bId;
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  beforeEach(done => {
    Post.remove({}, err => {
      done();
    });
  });

  describe("GET /post", () => {
    it("it should GET all the posts", done => {
      chai
        .request(app)
        .get(baseUrl + "/post")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("POST /post", () => {
    it("it should not POST a post without title field", done => {
      const post = {
        body:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        status: "DRAFTED",
        blogId
      };
      chai
        .request(app)
        .post(baseUrl + "/post")
        .set("x-access-token", token)
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("title");
          res.body.errors.title.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should not POST a post without body field", done => {
      const post = {
        title: "Let's jump together!",
        status: "DRAFTED",
        blogId
      };
      chai
        .request(app)
        .post(baseUrl + "/post")
        .set("x-access-token", token)
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("body");
          res.body.errors.body.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should not POST a post without blogId field", done => {
      const post = {
        title: "Let's jump together!",
        body:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        status: "DRAFTED"
      };
      chai
        .request(app)
        .post(baseUrl + "/post")
        .set("x-access-token", token)
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("blogId");
          res.body.errors.blogId.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should not POST a post without status field", done => {
      const post = {
        title: "Let's jump together!",
        body:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        blogId
      };
      chai
        .request(app)
        .post(baseUrl + "/post")
        .set("x-access-token", token)
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("status");
          res.body.errors.status.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should POST a post ", done => {
      const post = {
        title: "Let's jump together!",
        body:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        status: "DRAFTED",
        blogId
      };
      chai
        .request(app)
        .post(baseUrl + "/post")
        .set("x-access-token", token)
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("body");
          res.body.should.have.property("status").eql("DRAFTED");
          done();
        });
    });
  });
  describe("GET /post/:id", () => {
    it("it should GET a post by the given id", done => {
      const post = new Post({
        title: "Let's jump together!",
        body:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        status: "DRAFTED",
        blogId
      });
      post.save((err, post) => {
        chai
          .request(app)
          .get(baseUrl + "/post/" + post.id)
          .set("x-access-token", token)
          .send(post)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("title");
            res.body.should.have.property("body");
            res.body.should.have.property("status").eql("DRAFTED");
            res.body.should.have.property("_id").eql(post.id);
            done();
          });
      });
    });
  });
  describe("PUT /post/:id/publish", () => {
    it("it should publish a post", done => {
      const post = new Post({
        title: "Let's jump together!",
        body:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        status: "PUBLISHED",
        blogId
      });
      post.save((err, post) => {
        chai
          .request(app)
          .put(baseUrl + "/post/" + post.id + "/publish")
          .set("x-access-token", token)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("status").eql("PUBLISHED");
            done();
          });
      });
    });
  });
  describe("PUT /post/:id", () => {
    it("it should UPDATE a post given the id", done => {
      const post = new Post({
        title: "Let's jump together!",
        body:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        status: "PUBLISHED",
        blogId
      });
      post.save((err, post) => {
        chai
          .request(app)
          .put(baseUrl + "/post/" + post.id)
          .set("x-access-token", token)
          .send({
            title: "All world is a stage."
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("title").eql("All world is a stage.");
            done();
          });
      });
    });
  });
  describe("DELETE /post/:id", () => {
    it("it should DELETE a post given the id", done => {
      const post = new Post({
        title: "Let's jump together!",
        body:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        status: "PUBLISHED",
        blogId
      });
      post.save((err, post) => {
        chai
          .request(app)
          .delete(baseUrl + "/post/" + post.id)
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
