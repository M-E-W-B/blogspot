const bcrypt = require("bcrypt-nodejs");
const { ObjectId } = require("mongoose").Types;
const { MongooseConnect } = require("./utils");
const {
  User,
  UserFollowBlog,
  Blog,
  Post,
  Comment,
  Label,
  PostLabel,
  Group,
  GroupMember,
  Rule
} = require("./models");

const users = [
  {
    _id: ObjectId(),
    name: "Evan Austin",
    about:
      "Consectetur nulla repellat. Rerum rem deserunt est aperiam doloribus accusamus.",
    password: bcrypt.hashSync("yahoo", bcrypt.genSaltSync(8), null),
    email: "evan@yahoo.com",
    website: "http://gage.info",
    image: "https://s3.amazonaws.com/uifaces/faces/twitter/zvchkelly/128.jpg",
    gender: "male"
  },
  {
    _id: ObjectId(),
    name: "Rhonda Newman",
    about: "Tempora aut suscipit. Sed qui quo magnam delectus.",
    password: bcrypt.hashSync("google", bcrypt.genSaltSync(8), null),
    email: "rhonda@google.com",
    website: "https://samson.net",
    image: "https://s3.amazonaws.com/uifaces/faces/twitter/mylesb/128.jpg",
    gender: "female"
  },
  {
    _id: ObjectId(),
    name: "Nellie	Lambert",
    about:
      "Earum esse modi praesentium placeat est voluptatum. Sequi vitae omnis impedit optio omnis in. Sint ducimus placeat iure qui.",
    password: bcrypt.hashSync("microsoft", bcrypt.genSaltSync(8), null),
    email: "nellie@msn.com",
    website: "http://patricia.biz",
    image:
      "https://s3.amazonaws.com/uifaces/faces/twitter/bistrianiosip/128.jpg",
    gender: "male"
  }
];

const blogs = [
  {
    _id: ObjectId(),
    subdomain: "quibusdam",
    name: "Quia Quibusdam",
    description:
      "Consequatur molestiae vitae ducimus consectetur modi. Voluptates totam quam ducimus sequi aliquid earum ut. Omnis facilis corrupti illum.",
    owner: users[0]._id,
    status: "active"
  },
  {
    _id: ObjectId(),
    subdomain: "velit",
    name: "Omniscidunt Velit",
    description:
      "Unde aut asperiores nisi libero voluptatem aperiam tenetur excepturi molestiae. Optio consequatur pariatur. Maiores distinctio rerum dolorem sit officia. Eos sed qui eaque tempora nobis nesciunt nesciunt molestiae. Non error quo deserunt.",
    owner: users[1]._id,
    status: "active"
  }
];

const posts = [
  {
    _id: ObjectId(),
    title: "blog post title #1",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "drafted",
    blogId: blogs[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #2",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "drafted",
    blogId: blogs[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #3",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "drafted",
    blogId: blogs[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #4",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "drafted",
    blogId: blogs[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #5",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "drafted",
    blogId: blogs[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #6",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "published",
    blogId: blogs[1]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #8",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "published",
    blogId: blogs[1]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #9",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "published",
    blogId: blogs[1]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #10",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "published",
    blogId: blogs[1]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #11",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "published",
    blogId: blogs[1]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #12",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "published",
    blogId: blogs[1]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #13",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "published",
    blogId: blogs[1]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #21",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "published",
    blogId: blogs[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #22",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "published",
    blogId: blogs[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #24",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "published",
    blogId: blogs[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    title: "blog post title #25",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "published",
    blogId: blogs[0]._id,
    owner: users[0]._id
  }
];

const comments = [
  {
    _id: ObjectId(),
    txt: "this is comment txt #1",
    postId: posts[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    txt: "this is comment txt #2",
    postId: posts[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    txt: "this is comment txt #3",
    postId: posts[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    txt: "this is comment txt #4",
    postId: posts[0]._id,
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    txt: "this is comment txt #5",
    postId: posts[5]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    txt: "this is comment txt #6",
    postId: posts[5]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    txt: "this is comment txt #7",
    postId: posts[5]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    txt: "this is comment txt #8",
    postId: posts[5]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    txt: "this is comment txt #9",
    postId: posts[5]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    txt: "this is comment txt #10",
    postId: posts[5]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    txt: "this is comment txt #11",
    postId: posts[5]._id,
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    txt: "this is comment txt #12",
    postId: posts[5]._id,
    owner: users[1]._id
  }
];

const labels = [
  {
    _id: ObjectId(),
    txt: "this is label txt #1",
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    txt: "this is label txt #2",
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    txt: "this is label txt #3",
    owner: users[0]._id
  },
  {
    _id: ObjectId(),
    txt: "this is label txt #4",
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    txt: "this is label txt #5",
    owner: users[1]._id
  },
  {
    _id: ObjectId(),
    txt: "this is label txt #6",
    owner: users[1]._id
  }
];

const postlabels = [
  {
    _id: ObjectId(),
    postId: posts[0]._id,
    labelId: labels[0]._id
  },
  {
    _id: ObjectId(),
    postId: posts[0]._id,
    labelId: labels[1]._id
  },
  {
    _id: ObjectId(),
    postId: posts[0]._id,
    labelId: labels[2]._id
  },
  {
    _id: ObjectId(),
    postId: posts[5]._id,
    labelId: labels[2]._id
  },
  {
    _id: ObjectId(),
    postId: posts[5]._id,
    labelId: labels[2]._id
  },
  {
    _id: ObjectId(),
    postId: posts[5]._id,
    labelId: labels[3]._id
  }
];

const userfollowblogs = [
  {
    _id: ObjectId(),
    blogId: blogs[1]._id,
    userId: users[2]._id
  }
];

const groups = [
  {
    _id: ObjectId(),
    name: "Administrator",
    owner: users[0]._id
  }
];

const groupMembers = [
  {
    _id: ObjectId(),
    groupId: groups[0]._id,
    userId: users[0]._id
  }
];

const rules = [
  {
    _id: ObjectId(),
    description: "Anything on a Blog",
    operation: "*",
    modelname: "Blog",
    accessType: "group",
    groupId: groups[0]._id
  },
  {
    _id: ObjectId(),
    description: "Update a Blog",
    operation: "update",
    modelname: "Blog",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Update a Blog status",
    operation: "update_blog_status",
    modelname: "Blog",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Delete a Blog",
    operation: "delete",
    modelname: "Blog",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Anything on a Comment",
    operation: "*",
    modelname: "Comment",
    accessType: "group",
    groupId: groups[0]._id
  },
  {
    _id: ObjectId(),
    description: "Update a Comment",
    operation: "update",
    modelname: "Comment",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Delete a Comment",
    operation: "delete",
    modelname: "Comment",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Anything on a Label",
    operation: "*",
    modelname: "Label",
    accessType: "group",
    groupId: groups[0]._id
  },
  {
    _id: ObjectId(),
    description: "Update a Label",
    operation: "update",
    modelname: "Label",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Delete a Label",
    operation: "delete",
    modelname: "Label",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Anything on a Post",
    operation: "*",
    modelname: "Post",
    accessType: "group",
    groupId: groups[0]._id
  },
  {
    _id: ObjectId(),
    description: "Create a Post",
    operation: "create",
    modelname: "Blog",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Add a Label to a Post",
    operation: "post_add_label",
    modelname: "Post",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Remove a Label from a Post",
    operation: "post_remove_label",
    modelname: "Post",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Update a Post",
    operation: "update",
    modelname: "Post",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Publish a Post",
    operation: "post_publish",
    modelname: "Post",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Delete a Post",
    operation: "delete",
    modelname: "Post",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Anything on a User",
    operation: "*",
    modelname: "User",
    accessType: "group",
    groupId: groups[0]._id
  },
  {
    _id: ObjectId(),
    description: "Update a User",
    operation: "update",
    modelname: "User",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Delete a User",
    operation: "delete",
    modelname: "User",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "List groups of a User",
    operation: "list_user_groups",
    modelname: "User",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "List users of a Group",
    operation: "list_group_users",
    modelname: "Group",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Feed of a User",
    operation: "user_feed",
    modelname: "User",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "List of blogs that a User follows",
    operation: "list_user_follow_blogs",
    modelname: "User",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "List of blogs of a User",
    operation: "list_user_blogs",
    modelname: "User",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Follow a Blog",
    operation: "user_follow_blog",
    modelname: "User",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Unfollow a Blog",
    operation: "user_unfollow_blog",
    modelname: "User",
    accessType: "owner"
  },
  {
    _id: ObjectId(),
    description: "Anything on a Group",
    operation: "*",
    modelname: "Group",
    accessType: "group",
    groupId: groups[0]._id
  },
  {
    _id: ObjectId(),
    description: "Anything on a Rule",
    operation: "*",
    modelname: "Rule",
    accessType: "group",
    groupId: groups[0]._id
  }
];

MongooseConnect.open().then(async function() {
  await User.remove({});
  await User.insertMany(users);
  console.log("User added! 🐸");

  await Group.remove({});
  await Group.insertMany(groups);
  console.log("Group added! 🐸");

  await GroupMember.remove({});
  await GroupMember.insertMany(groupMembers);
  console.log("GroupMember added! 🐸");

  await Rule.remove({});
  await Rule.insertMany(rules);
  console.log("Rule added! 🐸");

  await UserFollowBlog.remove({});
  await UserFollowBlog.insertMany(userfollowblogs);
  console.log("UserFollowBlog added! 🐸");

  await Blog.remove({});
  await Blog.insertMany(blogs);
  console.log("Blog added! 🐸");

  await Post.remove({});
  await Post.insertMany(posts);
  console.log("Post added! 🐸");

  await Comment.remove({});
  await Comment.insertMany(comments);
  console.log("Comment added! 🐸");

  await Label.remove({});
  await Label.insertMany(labels);
  console.log("Label added! 🐸");

  await PostLabel.remove({});
  await PostLabel.insertMany(postlabels);
  console.log("PostLabel added! 🐸");

  // MongooseConnect.close();
});
