# Blogspot

<img alt="Blogspot" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Blogger.svg/2000px-Blogger.svg.png" width="200">

```sh
# generate seed data
node data/seed.js
```

```sh
# fill up the database
mongoimport --db blogspot --collection users --drop --file ./data/user.json
mongoimport --db blogspot --collection blogs --drop --file ./data/blog.json
mongoimport --db blogspot --collection comments --drop --file ./data/comment.json
mongoimport --db blogspot --collection posts --drop --file ./data/post.json
mongoimport --db blogspot --collection labels --drop --file ./data/label.json
mongoimport --db blogspot --collection blogposts --drop --file ./data/blog-post.json
mongoimport --db blogspot --collection labelposts --drop --file ./data/label-post.json
mongoimport --db blogspot --collection userblogs --drop --file ./data/user-blog.json
```
