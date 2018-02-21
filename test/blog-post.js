const chai = require("chai");
const bcrypt = require("bcrypt-nodejs");
const chaiHttp = require("chai-http");
const BlogPost = require("../models/blog-post");
const Blog = require("../models/blog");
const Post = require("../models/post");
const User = require("../models/user");
const app = require("../app");
const { MongooseConnect } = require("../utils");

const should = chai.should();
const baseUrl = "/api/v1";

let token;
let postId;
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

  const post = new Post({
    title: "Let's jump together!",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "DRAFTED"
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

  const postIdPromise = post
    .save()
    .then(post => post.id)
    .catch(err => {
      throw err;
    });

  return Promise.all([tokenPromise, blogIdPromise, postIdPromise]);
}

describe("BlogPost Routes", () => {
  before(function(done) {
    MongooseConnect.open()
      .then(() => {
        setGlobals()
          .then(([tkn, bId, pId]) => {
            token = tkn;
            blogId = bId;
            postId = pId;
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  beforeEach(done => {
    BlogPost.remove({}, err => {
      done();
    });
  });

  describe("GET /blog/:blogId/post", () => {
    it("it should GET all the posts of a blog", done => {
      chai
        .request(app)
        .get(baseUrl + "/blog/" + blogId + "/post")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("POST /blog/:blogId/post/:postId", () => {
    it("it should POST a blogpost", done => {
      chai
        .request(app)
        .post(baseUrl + "/blog/" + blogId + "/post/" + postId)
        .set("x-access-token", token)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("blogId").eql(blogId);
          res.body.should.have.property("postId").eql(postId);
          done();
        });
    });
  });
  describe("DELETE /blog/:blogId/post/:postId", () => {
    it("it should DELETE a blogpost", done => {
      const blogPost = new BlogPost({
        blogId,
        postId
      });
      blogPost.save((err, blogPost) => {
        chai
          .request(app)
          .delete(
            baseUrl + "/blog/" + blogPost.blogId + "/post/" + blogPost.postId
          )
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
