const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const store = require('../models/store');
const sendError = require('./send-error');

var validators = [
  check('text').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // validation error handling
      return res.status(422).json({ errors: errors.array() });
    }
    // filter unwanted properties
    var { text } = req.body;
    req.commentObj = { text };
    next();
  }
];

// Filter non-existing postId
router.all('/posts/:postId/*', (req, res, next) => {
  if (req.params.postId === undefined || !store.posts[req.params.postId]) {
    return sendError(res, 404, 'URI');
  }
  next();
});

// Get comment(s) by postId
router.get('/posts/:postId/comments', (req, res) => {
  if (req.query.id) { // values in req.query are all string
    if (!store.posts[req.params.postId].comments[req.query.id])
      return sendError(res, 404, 'URI');
    res.send(store.posts[req.params.postId].comments[req.query.id]);
  }
  res.status(200).send(store.posts[req.params.postId].comments);
});
// Get a comment by commentId & postId
router.get('/posts/:postId/comments/:commentId', (req, res) => {
  if (!store.posts[req.params.postId].comments[req.params.commentId])
    return sendError(res, 404, 'URI');
  res.send(store.posts[req.params.postId].comments[req.params.commentId]);
});

// Post a comment by postId
router.post('/posts/:postId/comments', [...validators, (req, res) => {
  var comments = store.posts[req.params.postId].comments;
  var commentId = comments.length;
  comments.push(req.commentObj);
  res.status(201).send({commentId: commentId});
}]);

// Update a comment by commentId & postId
router.put('/posts/:postId/comments/:commentId', [...validators, (req, res) => {
  var comments = store.posts[req.params.postId].comments,
    commentId = req.params.commentId;
  if (!comments[commentId]) return sendError(res, 404, 'URI');
  comments[commentId] = req.commentObj;
  res.status(200).send(comments[commentId]);
}]);

// Delete a comment by commentId & postId
router.delete('/posts/:postId/comments/:commentId', (req, res) => {
  if (!store.posts[req.params.postId].comments[req.params.commentId]) return sendError(res, 404, 'URI');
  store.posts[req.params.postId].comments[req.params.commentId] = null;
  res.status(204).send();
});

module.exports = router;
