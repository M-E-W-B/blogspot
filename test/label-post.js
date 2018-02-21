const chai = require("chai");
const bcrypt = require("bcrypt-nodejs");
const chaiHttp = require("chai-http");
const LabelPost = require("../models/label-post");
const Label = require("../models/label");
const Post = require("../models/post");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const { MongooseConnect } = require("../utils");

const should = chai.should();
const baseUrl = "/api/v1";

let token;
let postId;
let labelId;

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

  const label = new Label({
    txt: "Poetry"
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

  const labelIdPromise = label
    .save()
    .then(label => label.id)
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
        .then(post => {
          return post.id;
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      throw err;
    });

  return Promise.all([tokenPromise, labelIdPromise, postIdPromise]);
}

describe("LabelPost Routes", () => {
  before(function(done) {
    MongooseConnect.open()
      .then(() => {
        setGlobals()
          .then(([tkn, lId, pId]) => {
            token = tkn;
            labelId = lId;
            postId = pId;
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  beforeEach(done => {
    LabelPost.remove({}, err => {
      done();
    });
  });

  describe("GET /post/:postId/label", () => {
    it("it should GET all the labels of a post", done => {
      chai
        .request(app)
        .get(baseUrl + "/post/" + postId + "/label")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("POST /post/:postId/label/:labelId", () => {
    it("it should POST a labelpost", done => {
      chai
        .request(app)
        .post(baseUrl + "/post/" + postId + "/label/" + labelId)
        .set("x-access-token", token)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("labelId").eql(labelId);
          res.body.should.have.property("postId").eql(postId);
          done();
        });
    });
  });
  describe("DELETE /post/:postId/label/:labelId", () => {
    it("it should DELETE a labelpost", done => {
      const labelPost = new LabelPost({
        labelId,
        postId
      });
      labelPost.save((err, labelPost) => {
        chai
          .request(app)
          .delete(
            baseUrl +
              "/post/" +
              labelPost.postId +
              "/label/" +
              labelPost.labelId
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
