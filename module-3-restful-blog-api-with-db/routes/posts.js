const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const postModel = require('../models/postModel');
const mongodb = require('mongodb');

var validators = [
  check('name').not().isEmpty(),
  check('url').isURL(),
  check('text').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // validation error handling
      return res.status(422).json({ errors: errors.array() });
    }
    if (!req.body.comments) {  // give conmments an empty array if absent
      req.body.comments = [];
    }
    next();
  }
];

// Get posts
router.get('/posts', (req, res, next) =>
  postModel.then( db => db.collection('posts').find({}).toArray() )
    .then( posts => res.status(200).send(posts) )
    .catch(error => next(error))
);

// Add post
router.post('/posts', [...validators, (req, res, next) =>
  postModel.then( db => db.collection('posts').insert(req.body) )
    .then( results => res.status(201).send(results) )
    .catch(error => next(error))
]);

// Update post by postId
router.put('/posts/:postId', [...validators, (req, res, next) =>
  postModel.then( db => db.collection('posts').update(
    { _id: mongodb.ObjectID(req.params.postId) }, { $set: req.body }
  ) )
    .then( results => res.status(200).send(results) )
    .catch(error => next(error))
]);

// Delete post by postId
router.delete('/posts/:postId', (req, res, next) =>
  postModel.then( db => db.collection('posts').remove(
    { _id: mongodb.ObjectID(req.params.postId) }
  ) )
    .then( results => res.status(204).send() )
    .catch(error => next(error))
);

module.exports = router;
