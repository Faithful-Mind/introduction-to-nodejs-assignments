# Module 2 Assignment Lab: RESTful Blog API

A RESTful Blog API, with some validators

## Walk through the design of this project.
The CRUD implementations is similar to the previous exmaple in module-2. I wanted to have this API a validator. So I googled and added them after reading some guides on how to use express-validator.
- [Getting Started · express-validator](https://express-validator.github.io/docs/#basic-guide)

## How to build
```bash
npm i
npm start
```
## How to test
Use the following test cases.
Note: Empty value will get a error back because of the validators in [`routes/posts.js`](routes/posts.js) & [`routes/comments.js`](routes/comments.js).
```bash
#post post data
curl -H "Content-Type: application/json" -X POST -d '{"name":"Top 2 ES6 Features", "url":"http://webapplog.com/es6", "text":"let, const"}'  "http://localhost:3000/posts" 

#update post data at specific post id
curl -H 'Content-Type: application/json' -X PUT -d '{"name":"Top 3 ES6 Features Every Developer Must Know", "url":"http://webapplog.com/es6", "text":"let, const, arrow function"}' "http://localhost:3000/posts/1"

#get post data
curl "http://localhost:3000/posts"

#post comment data
curl -H 'Content-Type: application/json' -X POST -d '{"text":"Great!"}' "http://localhost:3000/posts/1/comments"

#update comment data at specific comment id & post id
curl -H 'Content-Type: application/json' -X PUT -d '{"text":"Awesome!"}' "http://localhost:3000/posts/1/comments/0"

#get comment data at specific post id
curl http://localhost:3000/posts/1/comments

#delete post data at specific post id
curl -X DELETE "http://localhost:3000/posts/1"
```

or (if you have `httpie` installed)

```bash
#post post data
http :3000/posts name="Top 2 ES6 Features" url="http://webapplog.com/es6" text="let, const"

#update post data at specific post id
http PUT :3000/posts/1 name="Top 3 ES6 Features Every Developer Must Know" url="http://webapplog.com/es6" text="let, const, arrow function"

#get post data
http :3000/posts

#post comment data
http :3000/posts/1/comments text="Great!"

#update comment data at specific comment id & post id
http PUT :3000/posts/1/comments/0 text="Awesome!"

#get comment data at specific post id
http :3000/posts/1/comments

#delete post data at specific post id
http DELETE :3000/posts/1
```
