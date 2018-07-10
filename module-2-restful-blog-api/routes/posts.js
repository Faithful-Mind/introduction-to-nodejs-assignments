const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const store = require('../models/store');

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
    req.postObj = { name, url, text, comments };
    next();
  }
];

// Get posts
router.get('/posts', (req, res) => {
  res.status(200).send(store.posts);
});

// Add a post
router.post('/posts', [...validators, (req, res) => {
  var postId = store.posts.length;
  store.posts.push(req.postObj);
  res.status(201).send({postId: postId});
}]);

// Update a post by postId
router.put('/posts/:postId', [...validators, (req, res) => {
  store.posts[req.params.postId] = req.postObj;
  res.status(200).send(store.posts[req.params.postId]);
}]);

// Delete a post by postId
router.delete('/posts/:postId', (req, res) => {
  if (!store.posts[req.params.postId]) {
    return res.sendStatus(404);
  }
  store.posts.splice(req.params.postId, 1);
  res.status(204).send();
});

module.exports = router;
