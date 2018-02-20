const faker = require("faker");
const fs = require("fs");
const { ObjectId } = require("mongoose").Types;

// min, max inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// collecting data
const users = Array.apply(null, Array(20)).map(function() {
  return {
    _id: ObjectId(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    website: faker.internet.url(),
    about: faker.lorem.sentence(),
    image: faker.image.avatar(),
    gender: Math.random() * 10 > 5 ? "MALE" : "FEMALE",
    createdAt: Date.now()
  };
});

const blogs = Array.apply(null, Array(20)).map(function() {
  return {
    _id: ObjectId(),
    subdomain: faker.internet.domainWord(),
    name: faker.lorem.word(),
    description: faker.lorem.paragraph(),
    image: faker.image.avatar(),
    status: Math.random() * 10 > 5 ? "ACTIVE" : "INACTIVE",
    createdAt: Date.now(),
    createdBy: users[getRandomIntInclusive(0, 10)]._id
  };
});

const posts = Array.apply(null, Array(30)).map(function() {
  return {
    _id: ObjectId(),
    title: faker.lorem.words(),
    body: faker.lorem.paragraphs(),
    status: Math.random() * 10 > 5 ? "PUBLISHED" : "DRAFTED",
    createdAt: Date.now()
  };
});

const labels = Array.apply(null, Array(20)).map(function() {
  return {
    _id: ObjectId(),
    txt: faker.lorem.words(),
    createdAt: Date.now(),
    createdBy: users[getRandomIntInclusive(0, 10)]._id
  };
});

const comments = Array.apply(null, Array(60)).map(function() {
  return {
    _id: ObjectId(),
    txt: faker.lorem.paragraph(),
    postId: posts[getRandomIntInclusive(0, 20)]._id,
    createdAt: Date.now(),
    createdBy: users[getRandomIntInclusive(0, 10)]._id
  };
});

const blogposts = Array.apply(null, Array(40)).map(function() {
  return {
    _id: ObjectId(),
    blogId: blogs[getRandomIntInclusive(0, 10)],
    postId: posts[getRandomIntInclusive(0, 20)]._id,
    createdAt: Date.now(),
    createdBy: users[getRandomIntInclusive(0, 10)]._id
  };
});

const labelposts = Array.apply(null, Array(40)).map(function() {
  return {
    _id: ObjectId(),
    labelId: labels[getRandomIntInclusive(0, 10)],
    postId: posts[getRandomIntInclusive(0, 20)]._id,
    createdAt: Date.now(),
    createdBy: users[getRandomIntInclusive(0, 10)]._id
  };
});

const userblogs = Array.apply(null, Array(40)).map(function() {
  return {
    _id: ObjectId(),
    userId: users[getRandomIntInclusive(0, 10)],
    blogId: blogs[getRandomIntInclusive(0, 10)]._id,
    createdAt: Date.now(),
    createdBy: users[getRandomIntInclusive(0, 10)]._id
  };
});

// writing data into the files
fs.writeFile(
  "./data/user.json",
  JSON.stringify(users, null, 2),
  "utf-8",
  err => {
    if (err) console.log(err);
    else console.log("Users file saved ✅!");
  }
);

fs.writeFile(
  "./data/blog.json",
  JSON.stringify(blogs, null, 2),
  "utf-8",
  err => {
    if (err) console.log(err);
    else console.log("Blogs file saved ✅!");
  }
);

fs.writeFile(
  "./data/post.json",
  JSON.stringify(posts, null, 2),
  "utf-8",
  err => {
    if (err) console.log(err);
    else console.log("Posts file saved ✅!");
  }
);

fs.writeFile(
  "./data/label.json",
  JSON.stringify(labels, null, 2),
  "utf-8",
  err => {
    if (err) console.log(err);
    else console.log("Labels file saved ✅!");
  }
);

fs.writeFile(
  "./data/comment.json",
  JSON.stringify(comments, null, 2),
  "utf-8",
  err => {
    if (err) console.log(err);
    else console.log("Comments file saved ✅!");
  }
);

fs.writeFile(
  "./data/blog-post.json",
  JSON.stringify(blogposts, null, 2),
  "utf-8",
  err => {
    if (err) console.log(err);
    else console.log("Blogposts file saved ✅!");
  }
);

fs.writeFile(
  "./data/label-post.json",
  JSON.stringify(labelposts, null, 2),
  "utf-8",
  err => {
    if (err) console.log(err);
    else console.log("Labelposts file saved ✅!");
  }
);

fs.writeFile(
  "./data/user-blog.json",
  JSON.stringify(userblogs, null, 2),
  "utf-8",
  err => {
    if (err) console.log(err);
    else console.log("Userblogs file saved ✅!");
  }
);
