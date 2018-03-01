# Blogspot

<img alt="Blogspot" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Blogger.svg/2000px-Blogger.svg.png" width="200">

### Fill up the database

```sh
node seed.js
```

#### Blog

```
POST  /blog
```

```
PUT /blog/:id
```

```
DELETE  /blog/:id  
```

```
PUT /blog/:id/status/:status
```

```
GET  /blog/:id
```

```
GET /blog/:id/full
```

```
GET /blog
```

```
GET /blog/:blogId/post
```

```
GET /user/:userId/blog
```

#### Post

```
POST  /post
```

```
PUT /post/:id
```

```
PUT /post/:id/publish
```

```
DELETE  /post/:id
```

```
GET /post/:id
```

```
GET /post/:id/full
```

```
GET /post
```

```
GET /user/:userId/post
```

#### Misc

```
GET /blog/:blogId/post
```

```
POST  /group/:groupId/user/:userId
```

```
DELETE  /group/:groupId/user/:userId
```

```
GET /group/:groupId/user
```

```
GET /user/:userId/group
```

```
POST  /user/:userId/follows/:blogId/blog
```

```
DELETE  /user/:userId/unfollows/:blogId/blog
```

```
GET /user/:userId/follows/blog
```

```
POST  /post/:postId/label/:labelId
```

```
DELETE  /post/:postId/label/:labelId
```

```
GET /post/:postId/label
```

```
GET /post/:postId/comment
```

```
GET /post/:postId/label
```

```
GET /label/:labelId/post
```

```
GET /user/:userId/feed
```

#### Comment

```
POST  /comment
```

```
PUT /comment/:id
```

```
DELETE  /comment/:id
```

```
GET /comment/:id
```

```
GET /comment
```

#### Group

```
POST  /group
```

```
PUT /group/:id
```

```
DELETE  /group/:id
```

```
GET /group/:id
```

```
GET /group
```

#### Label

```
POST  /label
```

```
PUT /label/:id
```

```
DELETE  /label/:id
```

```
GET /label/:id
```

```
GET /label
```

#### Rule

```
POST  /rule
```

```
PUT /rule/:id
```

```
DELETE  /rule/:id
```

```
GET /rule/:id
```

```
GET /rule
```

#### User

```
POST  /signup
```

```
PUT /user/:id
```

```
DELETE  /user/:id
```

```
GET /user/:id
```

```
GET /user
```
