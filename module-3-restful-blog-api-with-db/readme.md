# Module 3: RESTful Blog API

A RESTful Blog API, with some validators, using MongoDB as persistent storage.

## Walk through the design of this project.
The CRUD implementations is similar to the previous exmaple in module-2. I referenced some guides about how to use express-validator and how to deal with array in MongoDB documents.
- [Getting Started · express-validator](https://express-validator.github.io/docs/#basic-guide)
- [Update Documents in an Array - $ (update) — MongoDB Manual](https://docs.mongodb.com/manual/reference/operator/update/positional/#update-documents-in-an-array)
- [$push — MongoDB Manual](https://docs.mongodb.com/manual/reference/operator/update/push/)
- [How to remove array element in mongodb? - Stack Overflow -- Leonid Beschastny' Answer](https://stackoverflow.com/questions/16959099/how-to-remove-array-element-in-mongodb/16959700#16959700)

## How to build
```bash
npm i
npm start
```
## How to test
Use the following test cases. Replace `<postId>` below with the correct posts document ID you get in MongoDB.
Note: Empty value will get a error back because of the validators in [`routes/posts.js`](routes/posts.js) & [`routes/comments.js`](routes/comments.js).
```bash
#post post data
curl -H "Content-Type: application/json" -X POST -d '{"name":"Top 2 ES6 Features", "url":"http://webapplog.com/es6", "text":"let, const"}'  "http://localhost:3000/posts" 

#update post data at specific post id
curl -H 'Content-Type: application/json' -X PUT -d '{"name":"Top 3 ES6 Features Every Developer Must Know", "url":"http://webapplog.com/es6", "text":"let, const, arrow function"}' "http://localhost:3000/posts/<postId>"

#get post data
curl "http://localhost:3000/posts"

#post comment data
curl -H 'Content-Type: application/json' -X POST -d '{"text":"Great!"}' "http://localhost:3000/posts/<postId>/comments"

#update comment data at specific comment id & post id
curl -H 'Content-Type: application/json' -X PUT -d '{"text":"Awesome!"}' "http://localhost:3000/posts/<postId>/comments/0"

#get comment data at specific post id
curl http://localhost:3000/posts/<postId>/comments

#delete post data at specific post id
curl -X DELETE "http://localhost:3000/posts/<postId>"
```

or (if you have `httpie` installed)

```bash
#post post data
http :3000/posts name="Top 2 ES6 Features" url="http://webapplog.com/es6" text="let, const"

#update post data at specific post id
http PUT :3000/posts/<postId> name="Top 3 ES6 Features Every Developer Must Know" url="http://webapplog.com/es6" text="let, const, arrow function"

#get post data
http :3000/posts

#post comment data
http :3000/posts/<postId>/comments text="Great!"

#update comment data at specific comment id & post id
http PUT :3000/posts/<postId>/comments/0 text="Awesome!"

#get comment data at specific post id
http :3000/posts/<postId>/comments

#delete post data at specific post id
http DELETE :3000/posts/<postId>
```
