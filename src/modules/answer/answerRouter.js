const express = require('express');
const answerRouter = express.Router();

const {
    getAllAnswers,
    getUserAnswers,
    getMyAnswers,
    getQuestionAnswers
} = require('./select');
const { insertAnswer } = require('./insert');
const { updateAnswer } = require('./update');
const {
    deleteAnswerByAnswerOwner,
    deleteAnswerByQuestionOwner
} = require('./delete');

const { protect } = require('../../middlewares/authMiddleware');
const { validateAnswer } = require('../../middlewares/validationMiddleware')

answerRouter.get('/answer/get/all', getAllAnswers);
answerRouter.get('/answer/get/:uid', getUserAnswers);
answerRouter.get('/answer/get/ques-ans/:qid', getQuestionAnswers);
answerRouter.get('/answer/get/', protect, getMyAnswers);
answerRouter.post('/answer/insert/', protect, validateAnswer, insertAnswer);
answerRouter.patch('/answer/update/:aid', protect, updateAnswer);
answerRouter.delete('/answer/delete/ans-owner/:aid', protect, deleteAnswerByAnswerOwner);
answerRouter.delete('/answer/delete/ques-owner/:aid/:qid', protect, deleteAnswerByQuestionOwner);

module.exports = { answerRouter };