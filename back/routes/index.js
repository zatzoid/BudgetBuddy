const router = require('express').Router();
const { deleteUserMe, changeProfile, signOut } = require('../controllers/users');
const { validUserInfo } = require('../utils/validation');

router.patch('/user-me', validUserInfo,  changeProfile); //change user
router.delete('/user-me', deleteUserMe); // del user
router.post('/sign-out', signOut)
//posts
//  router.post('/post'); //create
//  router.delete('/post/:postId'); //deletelocal post
//  router.patch('/post/:postId'); //change local post
//  router.post('/post-all'); //post to all from local
//  //all posts
//  router.delete('/post-all/:postId'); //del post from all
//  router.delete('/post-all/:postId/comment'); //delete comment
//  router.post('/post-all/:postId/comment'); //create comment

module.exports = router