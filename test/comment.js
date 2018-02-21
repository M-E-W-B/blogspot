const chai = require("chai");
const bcrypt = require("bcrypt-nodejs");
const chaiHttp = require("chai-http");
const Comment = require("../models/comment");
const Post = require("../models/post");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const { MongooseConnect } = require("../utils");

const should = chai.should();
const baseUrl = "/api/v1";

let token;
let postId;

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

  const postIdPromise = blog
    .save()
    .then(blog => {
      const post = new Post({
        title: "Let's jump together!",
        body:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        status: "DRAFTED",
        blogId: blog._id
      });

      return post
        .save()
        .then(post => post.id)
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      throw err;
    });

  return Promise.all([tokenPromise, postIdPromise]);
}

describe("Comment Routes", () => {
  before(function(done) {
    MongooseConnect.open()
      .then(() => {
        setGlobals()
          .then(([tkn, pId]) => {
            token = tkn;
            postId = pId;
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  beforeEach(done => {
    Comment.remove({}, err => {
      done();
    });
  });

  describe("GET /comment", () => {
    it("it should GET all the comments", done => {
      chai
        .request(app)
        .get(baseUrl + "/comment")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("POST /comment", () => {
    it("it should not POST a comment without txt field", done => {
      const comment = {
        postId
      };
      chai
        .request(app)
        .post(baseUrl + "/comment")
        .set("x-access-token", token)
        .send(comment)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("txt");
          res.body.errors.txt.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should not POST a comment without postId field", done => {
      const comment = {
        txt: "Your post sucks."
      };
      chai
        .request(app)
        .post(baseUrl + "/comment")
        .set("x-access-token", token)
        .send(comment)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("postId");
          res.body.errors.postId.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should POST a comment ", done => {
      const comment = {
        txt: "Your post sucks.",
        postId
      };
      chai
        .request(app)
        .post(baseUrl + "/comment")
        .set("x-access-token", token)
        .send(comment)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("txt").eql("Your post sucks.");
          done();
        });
    });
  });
  describe("GET /comment/:id", () => {
    it("it should GET a comment by the given id", done => {
      const comment = new Comment({
        txt: "Your post sucks.",
        postId
      });
      comment.save((err, comment) => {
        chai
          .request(app)
          .get(baseUrl + "/comment/" + comment.id)
          .set("x-access-token", token)
          .send(comment)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("txt").eql("Your post sucks.");
            res.body.should.have.property("_id").eql(comment.id);
            done();
          });
      });
    });
  });
  describe("PUT /comment/:id", () => {
    it("it should UPDATE a comment given the id", done => {
      const comment = new Comment({
        txt: "Your post sucks.",
        postId
      });
      comment.save((err, comment) => {
        chai
          .request(app)
          .put(baseUrl + "/comment/" + comment.id)
          .set("x-access-token", token)
          .send({
            txt: "Your post sucks. Kill yourself."
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("txt")
              .eql("Your post sucks. Kill yourself.");
            done();
          });
      });
    });
  });
  describe("DELETE /comment/:id", () => {
    it("it should DELETE a comment given the id", done => {
      const comment = new Comment({
        txt: "Your post sucks.",
        postId
      });
      comment.save((err, comment) => {
        chai
          .request(app)
          .delete(baseUrl + "/comment/" + comment.id)
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
