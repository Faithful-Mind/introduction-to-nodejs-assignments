const express = require('express');
const router = express.Router({ mergeParams: true });
const { check, param, validationResult } = require('express-validator/check');
const postModel = require('../models/postModel');
const sendError = require('./send-error');

var idValidator = [
  param('commentId').isInt().toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 404);
    next();
  }
];

var inputValidators = [
  check('text').trim().not().isEmpty(),
  param('commentId').optional().isInt().toInt(),
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

// Get comment(s)
router.get('/comments', (req, res) =>
  (req.query.id ? postModel.getCommentById(req.params.postId, req.query.id)
    : postModel.getComments(req.params.postId))
    .then( comments => {
      if (!comments) throw 404;
      res.status(200).send(comments);
    } )
    .catch(error => {
      console.error(error);
      sendError(res, Number.isInteger(error) ? error : 500);
    })
);
// Get a comment by commentId
router.get('/comments/:commentId', idValidator, (req, res) =>
  postModel.getCommentById(req.params.postId, req.params.commentId)
    .then( comment => {
      if (!comment) throw 404;
      res.status(200).send(comment);
    } )
    .catch(error => {
      console.error(error);
      sendError(res, Number.isInteger(error) ? error : 500);
    })
);

// Add a comment
router.post('/comments', inputValidators, (req, res) =>
  postModel.addComment(req.params.postId, req.commentObj.text)
    .then( comment => {
      if (!comment) throw 500;
      res.status(201).send(comment);
    } )
    .catch(error => {
      console.error(error);
      sendError(res, Number.isInteger(error) ? error : 500);
    })
);

// Update a comment by commentId
router.put('/comments/:commentId', inputValidators, (req, res) =>
  postModel.updateCommentById(req.params.postId, req.params.commentId,
    req.commentObj.text
  )
    .then( comment => {
      if (!comment) throw 500;
      res.status(200).send(comment);
    } )
    .catch(error => {
      console.error(error);
      sendError(res, Number.isInteger(error) ? error : 500);
    })
);

// Delete a comment by commentId
router.delete('/comments/:commentId', idValidator, (req, res) =>
  postModel.deleteCommentById(req.params.postId, req.params.commentId)
    .then( results => {
      if (!results) throw 404;
      res.status(204).send();
    } )
    .catch(error => {
      console.error(error);
      sendError(res, Number.isInteger(error) ? error : 500);
    })
);

module.exports = router;
