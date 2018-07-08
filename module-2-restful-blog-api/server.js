const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const routes = require('./routes');
const postsRoutes = routes.posts;
const commentsRoutes = routes.comments;

const app = express();

app.use(bodyParser.json());
app.use(logger('dev'));

app.get('/posts', postsRoutes.getPosts);
app.post('/posts', postsRoutes.addPost);
app.put('/posts/:postId', postsRoutes.updatePost);
app.delete('/posts/:postId', postsRoutes.removePost);

app.get('/posts/:postId/comments', commentsRoutes.getComments);
app.post('/posts/:postId/comments', commentsRoutes.addComment);
app.put('/posts/:postId/comments/:commentId', commentsRoutes.updateComment);
app.delete('/posts/:postId/comments/:commentId', commentsRoutes.removeComment);

app.listen(3000);
