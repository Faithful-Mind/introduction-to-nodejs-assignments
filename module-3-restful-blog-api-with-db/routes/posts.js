const express = require('express');
const router = express.Router();
const { check, param, validationResult } = require('express-validator/check');
const postModel = require('../models/postModel');
const sendError = require('./send-error');

var idValidator = [
  param('postId').isMongoId(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 404);
    next();
  }
];

var inputValidators = [
  check('name', 'text').trim().not().isEmpty(),
  check('url').isURL(),
  param('postId').optional().isMongoId(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // validation error handling
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
router.get('/posts', (req, res) =>
  (req.query.id ? postModel.getPostById(req.query.id) : postModel.getPosts())
    .then( posts => {
      if (!posts) throw 404;
      res.status(200).send(posts);
    } )
    .catch(error => {
      console.error(error);
      sendError(res, Number.isInteger(error) ? error : 500);
    })
);
// Get a post by postId
router.get('/posts/:postId', idValidator, (req, res) =>
  postModel.getPostById(req.params.postId)
    .then( post => {
      if (!post) throw 404;
      res.status(200).send(post);
    } )
    .catch(error => {
      console.error(error);
      sendError(res, Number.isInteger(error) ? error : 500);
    })
);

// Add a post
router.post('/posts', inputValidators, (req, res) =>
  postModel.addPost(req.postObj)
    .then( post => {
      if (!post) throw 500;
      res.status(201).send(post);
    } )
    .catch(error => {
      console.error(error);
      sendError(res, Number.isInteger(error) ? error : 500);
    })
);

// Update a post by postId
router.put('/posts/:postId', inputValidators, (req, res) =>
  postModel.updatePostById(req.params.postId, req.postObj)
    .then( post => {
      if (!post) throw 500;
      res.status(200).send(post);
    } )
    .catch(error => {
      console.error(error);
      sendError(res, Number.isInteger(error) ? error : 500);
    })
);

// Delete a post by postId
router.delete('/posts/:postId', idValidator, (req, res) =>
  postModel.deletePostById(req.params.postId)
    .then( results => {
      if (!results) throw 404;
      res.status(204).send();
    } )
    .catch(error => {
      console.error(error);
      sendError(res, Number.isInteger(error) ? error : 500);
    })
);

router.all('/posts/:postId/*', idValidator);

module.exports = router;
