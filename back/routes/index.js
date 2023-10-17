const router = require('express').Router();
const { deleteUserMe, changeProfile, signOut } = require('../controllers/users');
const { validUserInfo } = require('../utils/validation');
const { uploadLocalPost, changeLocalPost, createLocalPost, deleteLocalPost } = require('../controllers/localPosts')
const { deleteCommentPublicPost, putCommentPublicPost, deletePublicPost } = require('../controllers/publicPosts')

router.patch('/user-me', validUserInfo, changeProfile); //change user
router.delete('/user-me', deleteUserMe); // del user
router.post('/sign-out', signOut)
//posts
router.post('/local-posts', createLocalPost); //create
router.delete('/local-posts/:postId', deleteLocalPost); //deletelocal post
router.patch('/local-posts/:postId', changeLocalPost); //  получает весь объект поста
//  //all posts
router.post('/public-posts/:postId', uploadLocalPost); //получает только id объекта из url
router.delete('/public-posts/:postId', deletePublicPost); //del post from all
/* { формат комментария
    "owner": {
        "_id": "652d1790f7ccc0be25d2258e",
        "avatar": "in progress",
        "name": "asd",
        "email": "test@gmail.com"
    },
    "comment": "привет"
} */
router.put('/public-posts/:postId/comment', putCommentPublicPost); //create comment
/* 
{commentId: "comment id from db"}
*/
 router.delete('/public-posts/:postId/comment', deleteCommentPublicPost); //delete comment

module.exports = router