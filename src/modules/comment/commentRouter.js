const express = require('express');
const commentRouter = express.Router();

const {
    getAllComments,
    getMyComments,
    getUserComments,
    getAnswerComments,
} = require('./select');
const { insertComment } = require('./insert');
const { updateComment } = require('./update');
const {
    deleteCommentByQuestionOwner,
    deleteCommentByCommentOwner
} = require('./delete');

const { protect } = require('../../middlewares/authMiddleware');
const { validateComment } = require('../../middlewares/validationMiddleware')

commentRouter.get('/comment/get/all', getAllComments);
commentRouter.get('/comment/get/:uid', getUserComments);
commentRouter.get('/comment/get/ans-comment/:aid', getAnswerComments);
commentRouter.get('/comment/get/', protect, getMyComments);
commentRouter.post('/comment/insert/', protect, validateComment, insertComment);
commentRouter.patch('/comment/update/:cid', protect, updateComment);
commentRouter.delete('/comment/delete/comm-owner/:cid', protect, deleteCommentByCommentOwner);
commentRouter.delete('/comment/delete/ques-owner/:cid/:aid', protect, deleteCommentByQuestionOwner);

module.exports = { commentRouter };