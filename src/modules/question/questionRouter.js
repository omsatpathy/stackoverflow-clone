const express = require('express');
const questionRouter = express.Router();

const {
    getAllQuestions,
    getMyQuestions,
    getUserQuestions
} = require('./select');
const { insertQuestion } = require('./insert');
const { updateQuestion } = require('./update');
const { deleteQuestion } = require('./delete');

const { protect } = require('../../middlewares/authMiddleware');
const { validateQuestion } = require('../../middlewares/validationMiddleware')

questionRouter.get('/question/get/all', getAllQuestions);
questionRouter.get('/question/get/:uid', getUserQuestions);
questionRouter.get('/question/get/', protect, getMyQuestions);
questionRouter.post('/question/insert', protect, validateQuestion, insertQuestion);
questionRouter.patch('/question/update/:qid', protect, updateQuestion);
questionRouter.delete('/question/delete/:qid', protect, deleteQuestion);

module.exports = {  questionRouter };
