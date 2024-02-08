const asyncHandler = require("express-async-handler");
const { execute } = require('../../utils/dbConnect');
const { sendResponse } = require("../../utils/sendResponse");

const _getAllAnswers = () => `
    SELECT 
        aid as answerId,
        atext as answerText,
        qid as questionId,
        uid as userId,
        createdAt,
        updatedAt
    FROM
        answers;
`

const _getAnswersByUserId = () => `
    SELECT 
        aid as answerId,
        atext as answerText,
        qid as questionId,
        uid as userId,
        createdAt,
        updatedAt
    FROM
        answers
    WHERE
        uid = ?
`

const _getAnswersForAQuestion = () => `
    SELECT 
        aid as answerId,
        atext as answerText,
        qid as questionId,
        uid as userId,
        createdAt,
        updatedAt
    FROM
        answers
    WHERE
        qid = ?
`

const getAllAnswers = asyncHandler(async (req, res) => {

    const answerData = await execute(_getAllAnswers());

    return sendResponse(
        res,
        answerData instanceof Error ? answerData : { message: 'Answer data fetched.', answerData },
        200
    )

})

const getUserAnswers = asyncHandler(async (req, res) => {
    const uid = req.params.uid;

    const queryData = [uid];

    const answerData = await execute(_getAnswersByUserId(), queryData);

    return sendResponse(
        res,
        answerData instanceof Error ? answerData : { message: 'Answer data fetched.', answerData },
        200
    )
})

const getMyAnswers = asyncHandler(async (req, res) => {
    const { uid } = req.user;

    const queryData = [uid];

    const answerData = await execute(_getAnswersByUserId(), queryData);

    return sendResponse(
        res,
        answerData instanceof Error ? answerData : { message: 'Answer data fetched.', answerData },
        200
    )
})

const getQuestionAnswers = asyncHandler(async (req, res) => {
    const { qid } = req.params;
    const queryData = [qid];
    const answerData = await execute(_getAnswersForAQuestion(), queryData);

    return sendResponse(
        res,
        answerData instanceof Error ? answerData : { message: 'Answer data fetched.', answerData },
        200
    )
})

module.exports = { 
    getAllAnswers,
    getUserAnswers,
    getMyAnswers,
    getQuestionAnswers
 };