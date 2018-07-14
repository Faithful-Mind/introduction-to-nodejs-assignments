const router = require('express').Router();
const postsRouter = require('./posts');
const commentsRouter = require('./comments');

postsRouter.use('/posts/:postId/', commentsRouter);

router.use(postsRouter);

module.exports = router;
