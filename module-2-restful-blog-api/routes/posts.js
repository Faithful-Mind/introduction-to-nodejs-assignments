const { check, validationResult } = require('express-validator/check');
const store = require('../data/store');

var posts = {
  getPosts(req, res) {
    res.status(200).send(store.posts);
  },
  addPost(req, res) {
    var obj = req.body;
    if (!obj.comments) {
      obj.comments = [];
    }
    var postId = store.posts.length;
    store.posts.push(obj);
    res.status(201).send({postId: postId});
  },
  updatePost(req, res) {
    var obj = req.body;
    if (!obj.comments) {
      obj.comments = [];
    }
    store.posts[req.params.postId] = req.body;
    res.status(200).send(store.posts[req.params.postId]);
  },
  removePost(req, res) {
    store.posts.splice(req.params.postId, 1);
    res.status(204).send();
  }
};

var validators = [
  check('name').not().isEmpty(),
  check('url').isURL(),
  check('text').not().isEmpty(),
  (req, res, next) => { // validation error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];

posts.addPost = [...validators, posts.addPost];
posts.updatePost = [...validators, posts.updatePost];

module.exports = posts;
