const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/edx-course-db';

mongoose.connect(url).catch(err => console.error(err));

const commentSchema = mongoose.Schema({
  commentId: Number,
  text: String,
}, { _id: false });

const postSchema = mongoose.Schema({
  name: String,
  url: String,
  text: String,
  comments: [commentSchema],
});

const Post = mongoose.model("Post", postSchema);

exports.getPosts = () => Post.find();

exports.getPostById = (postId) => Post.findById(postId);

/**
 * Add a post.
 * @param {Object} postObj post object like `{ _id: Number, name: String,
                                               url: String, text: String }`
 * @returns added post object if success else `null`
 */
exports.addPost = (postObj) => {
  var { name, url, text } = postObj;
  var newPost = new Post({ name, url, text });
  return newPost.save();
};

/**
 * Update a post by ID.
 * @param {Number} postId post ID to update
 * @param {Object} postObj post object like `{ _id: Number, name: String,
                                               url: String, text: String }`
 * @returns updated post object if success else `null`
 */
exports.updatePostById = (postId, postObj) => {
  var { name, url, text } = postObj;
  return Post.findOne({ _id: postId }).then(post =>
    post ? Object.assign(post, { name, url, text }) && post.save() : null
  );
};

/**
 * Delete a post by ID.
 * @param {Number} postId post ID to delete
 * @returns deleted post object like `{ _id: Number, name: String, url: String,
                                        text: String }` if success else `null`
 */
exports.deletePostById = (postId) =>
  Post.findOne({ _id: postId }).then(o => o ? o.remove() : null);

exports.getComments = (postId) =>
  exports.getPostById(postId).then(post => post ? post.comments : null);

exports.getCommentById = (postId, commentId) =>
  exports.getComments(postId).then(comments =>
    (comments || []).find(ele => ele.commentId === commentId) || null
  );

/**
 * Add the text comment to specified post ID.
 * @param {Number} postId post ID to locate coment
 * @param {String} text comment's text content
 * @returns generated comment object like `{ commentId: Number, text: String }`
 * if success else `null`
 */
exports.addComment = (postId, text) =>
  exports.getPostById(postId).then(post => {
    if (!post) return null;
    var comments = post.comments;
    // get the last (also biggest) commentId and plus 1 as new commentId. Use 1 directly if NaN
    var commentId = (comments[comments.length -1] || {}).commentId +1 || 1;
    comments.push({ commentId, text });
    return post.save().then(post => post ? { commentId, text } : null);
  });

/**
 * Update a comment by text, comment ID & post ID.
 * @param {Number} postId post ID to locate comment
 * @param {Number} commentId comment ID to update
 * @param {String} text comment's text content used to replace the old one
 * @returns updated comment object like `{ commentId: Number, text: String }`
 * if success else `null`
 */
exports.updateCommentById = (postId, commentId, text) =>
  exports.getPostById(postId).then(post => {
    if (!post) return null;
    var comment = post.comments.find(ele => ele.commentId === commentId);
    if (!comment) return null;
    comment.text = text;
    return post.save().then(post => post ? { commentId, text } : null);
  });

/**
 * Delete a comment by comment ID & post ID.
 * @param {Number} postId post ID to locate coment
 * @param {Number} commentId comment ID to delete
 * @returns deleted comment object like `{ commentId: Number, text: String }`
 * if success else `null`
 */
exports.deleteCommentById = (postId, commentId) =>
  exports.getPostById(postId).then(post => {
    if (!post) return null;
    var ok = false, text = "";
    for (let i = post.comments.length -1; i >= 0; i--) {
      if (post.comments[i].commentId === commentId) {
        text = post.comments[i].text;
        post.comments.splice(i, 1);
        ok = true;
      }
    }
    return ok ? post.save().then(post => post ? { commentId, text } : null) : null;
  });
