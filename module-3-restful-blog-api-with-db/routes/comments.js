const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const postModel = require('../models/postModel');
const mongodb = require('mongodb');

var validators = [
  check('text').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // validation error handling
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];

// Get comments
router.get('/posts/:postId/comments', (req, res, next) =>
  postModel.then( db => db.collection('posts').findOne(
    { _id: mongodb.ObjectID(req.params.postId) }
  ) )
    .then( post => res.status(200).send(post.comments) )
    .catch(error => next(error))
);

// Post a comment
router.post('/posts/:postId/comments', [...validators, (req, res, next) =>
  postModel.then( db => db.collection('posts').findOne(
    { _id: mongodb.ObjectID(req.params.postId) }
  ) )
    .then( post =>
      postModel.then( db => db.collection('posts').update(
        { _id: mongodb.ObjectID(req.params.postId) },
        { $push: {
          comments:
            {
              // get the last commentId, also biggest, and add by 1 as new commentId
              commentId: post.comments[post.comments.length - 1].commentId + 1,
              text: req.body.text
            }
          }
        }
      ) )
        .then( results => res.status(201).send(results) )
        .catch(error => next(error))
    )
    .catch(error => next(error))

]);

// Update a comment by commentId
router.put('/posts/:postId/comments/:commentId', [...validators, (req, res, next) =>
  postModel.then( db => db.collection('posts').update(
    {
      _id: mongodb.ObjectID(req.params.postId),
      'comments.commentId': parseInt(req.params.commentId)
    },
    { $set: { 'comments.$.text': req.body.text } }
  ) )
    .then( results => res.status(200).send(results) )
    .catch(error => next(error))
]);

// Delete a comment by commentId
router.delete('/posts/:postId/comments/:commentId', (req, res, next) =>
  postModel.then( db => db.collection('posts').update(
    {
      _id: mongodb.ObjectID(req.params.postId),
      'comments.commentId': parseInt(req.params.commentId)
    },
    { $pull: { 'comments': { commentId: parseInt(req.params.commentId) } } }
  ) )
    .then(results => res.status(200).send(results))
    .catch(error => next(error))

  // .then( () => res.status(204).send() )
);

module.exports = router;
