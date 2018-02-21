const chai = require("chai");
const bcrypt = require("bcrypt-nodejs");
const chaiHttp = require("chai-http");
const UserBlog = require("../models/user-blog");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const { MongooseConnect } = require("../utils");

const should = chai.should();
const baseUrl = "/api/v1";

let token;
let blogId;
let userId;

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
        .then(res => {
          return { token: res.body.token, userId: user.id };
        })
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

describe("UserBlog Routes", () => {
  before(function(done) {
    MongooseConnect.open()
      .then(() => {
        setGlobals()
          .then(([o, bId]) => {
            token = o.token;
            userId = o.userId;
            blogId = bId;
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  beforeEach(done => {
    UserBlog.remove({}, err => {
      done();
    });
  });

  describe("GET /user/follows/blog", () => {
    it("it should GET all blogs that a user follows", done => {
      chai
        .request(app)
        .get(baseUrl + "/user/follows/blog")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("POST /user/follows/:blogId/blog", () => {
    it("it should POST a userblog", done => {
      chai
        .request(app)
        .post(baseUrl + "/user/follows/" + blogId + "/blog")
        .set("x-access-token", token)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("blogId").eql(blogId);
          done();
        });
    });
  });
  // describe("DELETE /user/unfollows/:blogId/blog", () => {
  //   it("it should DELETE a userblog", done => {
  //     const userBlog = new UserBlog({
  //       userId,
  //       blogId
  //     });
  //     userBlog.save((err, userBlog) => {
  //       chai
  //         .request(app)
  //         .delete(baseUrl + "/user/unfollows/" + blogId + "/blog")
  //         .set("x-access-token", token)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.be.a("object");
  //           res.body.should.have.property("ok").eql(1);
  //           res.body.should.have.property("n").eql(1);
  //           done();
  //         });
  //     });
  //   });
  // });
});
