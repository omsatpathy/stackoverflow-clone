const asyncHandler = require("express-async-handler");
const { execute } = require("../../utils/dbConnect");
const { CustomError } = require('../../middlewares/errorMiddleware')

const _getAnswerUid = () => `
    SELECT 
        uid
    FROM
        answers
    WHERE
        aid = ?
`

const _deleteAnswerByAnswerOwner = () => `
    DELETE FROM
        answers
    WHERE
        aid = ? and uid = ?
`

const _getQuestionUid = () => `
    SELECT 
        q.uid
    FROM
        answers a
            JOIN
        questions q ON a.qid = q.qid
    WHERE
        a.qid = ?
    GROUP BY (q.uid);
`

const _deleteAnswerByQuestionOwner = () => `
    DELETE FROM
        answers
    WHERE
        aid = ?
`

const deleteAnswerByAnswerOwner = asyncHandler(async (req, res) => {
    const { aid } = req.params;
    const { uid } = req.user;
    const getAnswerUidQueryData = [aid];
    const answerUid = await execute(_getAnswerUid(), getAnswerUidQueryData);

    if(answerUid instanceof Error) {
        throw new CustomError(resultArr1, 400);
    }

    const ansOwnerId = answerUid[0].uid;
    if(ansOwnerId !== uid) {
        throw new CustomError("Not authorized to delete.", 400)
    }

    const deleteAnswerQueryData = [aid, uid];
    const deletedAnswerDetails = await execute(_deleteAnswerByAnswerOwner(), deleteAnswerQueryData);

    return sendResponse(
        res,
        deletedAnswerDetails instanceof Error ? deletedAnswerDetails : { message: 'Answer deleted successfully.', deletedAnswerDetails },
        200
    )
});

const deleteAnswerByQuestionOwner = asyncHandler(async (req, res) => {
    const { aid, qid } = req.params;
    const { uid } = req.user;
    const getQuestionUidQueryData = [qid]
    const questionUid = await execute(_getQuestionUid(), getQuestionUidQueryData);

    if(questionUid instanceof Error) {
        throw new CustomError(questionUid, 400);
    }

    const quesOwnerId = questionUid[0].uid;
    if(quesOwnerId !== uid) {
        throw new CustomError("Not authorized to delete.", 401)
    }

    const deleteAnswerQueryData = [aid];
    const deletedAnswerDetails = await execute(_deleteAnswerByQuestionOwner(),deleteAnswerQueryData);

    return sendResponse(
        res,
        deletedAnswerDetails instanceof Error ? deletedAnswerDetails : { message: 'Answer deleted successfully.', deletedAnswerDetails },
        200
    )
});

module.exports = {
    deleteAnswerByAnswerOwner,
    deleteAnswerByQuestionOwner
};