const router = require('express').Router();
const { deleteUserMe, changeProfile, signOut, getUserMe } = require('../controllers/users');
const { validUserInfo } = require('../utils/validation');
const { patchCashDataLP, putCashDataLocalPost, uploadLocalPost, deleteCashDataLocalPost, createLocalPost, getUserLocalPosts } = require('../controllers/localPosts')
const { getAllPublicPosts, deleteCommentPublicPost, putCommentPublicPost, deletePublicPost } = require('../controllers/publicPosts')
const { createEmailDataToSend } = require('../controllers/LPreminder')

router.patch('/user-me', validUserInfo, changeProfile); //change user
router.delete('/user-me', deleteUserMe); // del user
router.post('/sign-out', signOut);
router.get('/user-me', getUserMe);
//posts
router.get('/local-posts', getUserLocalPosts);
router.post('/local-posts', createLocalPost); //create
router.put('/local-posts/:postId', putCashDataLocalPost) //add profit/lose
router.delete('/local-posts/:postId', deleteCashDataLocalPost);
router.post('/local-posts/remind', createEmailDataToSend) //deletelocal post
router.patch('/local-posts/:postId', patchCashDataLP)
//  router.patch('/local-posts/:postId', deleteCashDataLocalPost); //  получает весь объект поста
//  //all posts
router.get('/public-posts', getAllPublicPosts)
router.post('/public-posts/:postId', uploadLocalPost); //получает только id объекта из url
router.delete('/public-posts/:postId', deletePublicPost); //del post from all
router.put('/public-posts/:postId/comment', putCommentPublicPost); //create comm
/* 
{commentId: "comment id from db"}
*/
router.delete('/public-posts/:postId/comment', deleteCommentPublicPost); //delete comment

module.exports = router