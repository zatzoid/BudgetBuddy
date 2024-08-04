import express from 'express'
import { deleteUserMe, changeProfile, signOut, getUserMe } from '../controllers/users.js';
import { validUserInfo } from '../utils/validation.js';

import { patchCashDataLP, putCashDataLocalPost, deleteCashDataLocalPost, createLocalPost, getUserLocalPosts, createEmailDataToSend } from '../controllers/localPosts.js';

const router = express.Router()
router.patch('/user-me', validUserInfo, changeProfile); //change user
router.delete('/user-me', deleteUserMe); // del user
router.post('/sign-out', signOut);
router.get('/user-me', getUserMe);
//posts
router.get('/local-posts', getUserLocalPosts);
router.post('/local-posts', createLocalPost); //create
router.put('/local-posts/:postId', putCashDataLocalPost) //add profit/lose
router.delete('/local-posts/:postId', deleteCashDataLocalPost);
router.patch('/local-posts/:postId', patchCashDataLP)

router.post('/local-posts/remind', createEmailDataToSend) //deletelocal post



export default router