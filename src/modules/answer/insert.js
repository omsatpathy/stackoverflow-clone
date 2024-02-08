const asyncHandler = require("express-async-handler");

const { execute } = require("../../utils/dbConnect");
const { sendResponse } = require("../../utils/sendResponse");
const { CustomError } = require('../../middlewares/errorMiddleware')

const _getQuestionUid = () => `
    SELECT 
        uid
    FROM
        questions
    WHERE uid = ?
`

const _insertAnswer = () => `
    INSERT INTO
        answers 
    VALUES (?, ?, ?, ?, now(), now())
`

const insertAnswer = asyncHandler(async (req, res) => {
    const { aid, atext, qid } = req.body;

    const { uid } = req.user;
    const getQuestionUidQueryData = [uid];
    const questionUid = await execute(_getQuestionUid(), getQuestionUidQueryData);
    
    if(questionUid instanceof Error) {
        throw new CustomError(questionUid, 400);
    }

    if(uid === questionUid[0].uid) {
        throw new CustomError("You can't answer your own question.", 400);
    }

    const insertAnswerQueryData = [aid, atext, qid, uid]
    const insertedAnswerDetails = await execute(_insertAnswer(), insertAnswerQueryData);

    return sendResponse(
        res,
        insertedAnswerDetails instanceof Error ? insertedAnswerDetails : { message: 'Answer succesfully inserted.', answerData: {...req.body, uid} },
        200
    )
})

module.exports = { insertAnswer };