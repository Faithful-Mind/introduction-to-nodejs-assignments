const mongodb = require('mongodb');

let store = {
  posts: [
    {name: 'Top 10 ES6 Features every Web Developer must know',
    url: 'https://webapplog.com/es6',
    text: 'This essay will give you a quick introduction to ES6. If you don’t know what is ES6, it’s a new JavaScript implementation.',
    comments: [
      {text: 'Cruel…..var { house, mouse} = No type optimization at all'},
      {text: 'I think you’re undervaluing the benefit of ‘let’ and ‘const’.'},
      {text: '(p1,p2)=>{ … } ,i understand this ,thank you !'}
    ]
    }
  ]
};
const url = 'mongodb://localhost:27017/edx-course-db';

var db = mongodb.MongoClient.connect(url).catch(error => {
  console.error(error);
  process.exit(1);
});

exports.getPosts = () =>
  db.then( db => db.collection('posts').find({}).toArray() );

exports.getPostById = (postId) =>
  db.then( db => db.collection('posts').findOne(
    { _id: mongodb.ObjectID(postId) }
  ) );

exports.addPost = (postObj) =>
  db.then( db => db.collection('posts').insertOne(postObj) )
    .then( result => result.ops[result.insertedCount - 1] );

exports.updatePostById = (postId, postObj) =>
  db.then( db => db.collection('posts').updateOne(
    { _id: mongodb.ObjectID(postId) }, { $set: postObj }
  ) ).then( result => {
    if (!result.result.ok || !result.modifiedCount) return null;
    return { postId, ...postObj };
  } );

exports.deletePostById = (postId) =>
  db.then( db => db.collection('posts').deleteOne(
    { _id: mongodb.ObjectID(postId) }
  ) ).then( result => {
    if (!result.result.ok || !result.deletedCount) return null;
    return 'Deleted ' + result.deletedCount;
  } );

exports.getComments = (postId) =>
db.then( db => db.collection('posts').findOne(
  { _id: mongodb.ObjectID(postId) }
) ).then( post => (post || {}).comments );

exports.getCommentById = (postId, commentId) =>
  db.then( db => db.collection('posts').findOne(
    {
      _id: mongodb.ObjectID(postId), 'comments.commentId': parseInt(commentId)
    }
  ) ).then( post =>
    ((post || {}).comments || []).find(ele => ele.commentId === commentId)
  );

exports.addComment = (postId, text) =>
  exports.getComments(postId).then( comments => {
    // get the last commentId, also biggest, and add by 1 as new commentId
    var commentId = (comments[comments.length -1] || 1).commentId + 1 || 1;
    return db.then( db => db.collection('posts').updateOne(
      { _id: mongodb.ObjectID(postId) },
      { $push: { comments: { commentId, text } } }
    ) ).then( result => {
      if (!result.result.ok || !result.modifiedCount) return null;
      return { commentId, text };
    } );
  } );

exports.updateCommentById = (postId, commentId, text) =>
  db.then( db => db.collection('posts').updateOne(
    {
      _id: mongodb.ObjectID(postId), 'comments.commentId': parseInt(commentId)
    },
    { $set: { 'comments.$.text': text } }
  ) ).then( result => {
    if (!result.result.ok || !result.modifiedCount) return null;
    return { commentId, text };
  } );

exports.deleteCommentById = (postId, commentId) =>
  db.then( db => db.collection('posts').updateOne(
    {
      _id: mongodb.ObjectID(postId), 'comments.commentId': parseInt(commentId)
    },
    { $pull: { 'comments': { commentId: parseInt(commentId) } } }
  ) ).then( result => {
    if (!result.result.ok || !result.modifiedCount) return null;
    return 'Deleted';
  } );
