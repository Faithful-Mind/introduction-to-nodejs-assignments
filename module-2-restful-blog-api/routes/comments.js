const { check, validationResult } = require('express-validator/check');
const store = require('../data/store');

var comments = {
  getComments(req, res) {
    res.status(200).send(store.posts[req.params.postId].comments);
  },
  addComment(req, res) {
    var comments = store.posts[req.params.postId].comments;
    var commentId = comments.length;
    comments.push(req.body);
    res.status(201).send({commentId: commentId});
  },
  updateComment(req, res) {
    var comments = store.posts[req.params.postId].comments;
    comments[req.params.commentId] = req.body;
    res.status(200).send(comments[req.params.commentId]);
  },
  removeComment(req, res) {
    store.posts[req.params.postId].comments.splice(req.params.commentId, 1);
    res.status(204).send();
  }
};

var validators = [
  check('text').not().isEmpty(),
  (req, res, next) => { // validation error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];

comments.addComment = [...validators, comments.addComment];
comments.updateComment = [...validators, comments.updateComment];

module.exports = comments;
