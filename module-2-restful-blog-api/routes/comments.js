const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const store = require('../models/store');

var validators = [
  check('text').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // validation error handling
      return res.status(422).json({ errors: errors.array() });
    }
    // filter unwanted properties
    var { text, } = req.body;
    req.commentObj = { text };
    next();
  }
];

// Filter non-existing postId
router.all('/posts/:postId/*', (req, res, next) => {
  if (req.params.postId === undefined || !store.posts[req.params.postId]) {
    return res.sendStatus(404);
  }
  next();
});

// Get comments by postId
router.get('/posts/:postId/comments', (req, res) => {
  res.status(200).send(store.posts[req.params.postId].comments);
});

// Post a comment by commentId & postId
router.post('/posts/:postId/comments', [...validators, (req, res) => {
  var comments = store.posts[req.params.postId].comments;
  var commentId = comments.length;
  comments.push(req.commentObj);
  res.status(201).send({commentId: commentId});
}]);

// Update a comment by commentId & postId
router.put('/posts/:postId/comments/:commentId', [...validators, (req, res) => {
  var comments = store.posts[req.params.postId].comments;
  comments[req.params.commentId] = req.commentObj;
  res.status(200).send(comments[req.params.commentId]);
}]);

// Delete a comment by commentId & postId
router.delete('/posts/:postId/comments/:commentId', (req, res) => {
  if (!store.posts[req.params.postId].comments[req.params.commentId]) {
    return res.sendStatus(404);
  }
  store.posts[req.params.postId].comments.splice(req.params.commentId, 1);
  res.status(204).send();
});

module.exports = router;
