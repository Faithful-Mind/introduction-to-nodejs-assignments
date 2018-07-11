const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const store = require('../models/store');
const sendError = require('./send-error');

var validators = [
  check('name').not().isEmpty(),
  check('url').isURL(),
  check('text').not().isEmpty(),
  (req, res, next) => { // validation error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    if (!req.body.comments) { // give comments field an empty array if absent
      req.body.comments = [];
    }
    // filter unwanted properties
    var { name, url, text, comments } = req.body;
    if (req.method === 'PUT') req.postObj = { name, url, text };
    else                      req.postObj = { name, url, text, comments };
    next();
  }
];

// Get post(s)
router.get('/posts', (req, res) => {
  if (req.query.id) { // values in req.query are all string
    if (!store.posts[req.query.id]) return sendError(res, 404, 'URI');
    return res.send(store.posts[req.query.id]);
  }
  res.status(200).send(store.posts);
});
// Get a post by postId
router.get('/posts/:postId', (req, res) => {
  if (!store.posts[req.params.postId]) return sendError(res, 404, 'URI');
  res.send(store.posts[req.params.postId]);
});

// Add a post
router.post('/posts', [...validators, (req, res) => {
  var postId = store.posts.length;
  store.posts.push(req.postObj);
  res.status(201).send({ postId: postId, ...req.postObj });
}]);

// Update a post by postId
router.put('/posts/:postId', [...validators, (req, res) => {
  var oldPost = store.posts[req.params.postId];
  if (!oldPost) return sendError(res, 404, 'URI');
  store.posts[req.params.postId] = Object.assign(oldPost, req.postObj);
  res.status(200).send(store.posts[req.params.postId]);
}]);

// Delete a post by postId
router.delete('/posts/:postId', (req, res) => {
  if (!store.posts[req.params.postId]) return sendError(res, 404, 'URI');
  store.posts[req.params.postId] = null;
  res.status(204).send();
});

module.exports = router;
