const asyncHandler = require("express-async-handler");
const { execute } = require('../../utils/dbConnect')
const {sendResponse} = require('../../utils/sendResponse')

const _getAllQuestions = () => `
    SELECT 
        qid as questionId,
        qtitle as questionTitle,
        qdescription as questionDescription,
        uid as userId,
        createdAt,
        updatedAt
    FROM
        questions;
`

const _getQuestionsByUserId = () => `
    SELECT 
        qid as questionId,
        qtitle as questionTitle,
        qdescription as questionDescription,
        uid as userId,
        createdAt,
        updatedAt
    FROM
        questions
    WHERE 
        uid = ?
`

// const _getQuestionsByLoggedInUser = () => `
//     SELECT 
//         qid as questionId,
//         qtitle as questionTitle,
//         qdescription as questionDescription,
//         uid as userId,
//         createdAt,
//         updatedAt
//     FROM
//         questions
//     WHERE 
//         uid = ?
// `

const getAllQuestions = asyncHandler(async (req, res) => {

    const questionData = await execute(_getAllQuestions());

    return sendResponse(
        res,
        questionData instanceof Error ? questionData : { message: 'Question data fetched.', questionData },
        200
    )

})

const getUserQuestions = asyncHandler(async (req, res) => {
    const uid = req.params.uid;

    const queryData = [uid];

    const questionData = await execute(_getQuestionsByUserId(), queryData);

    return sendResponse(
        res,
        questionData instanceof Error ? questionData : { message: 'Question data fetched.', questionData },
        200
    )
})

const getMyQuestions = asyncHandler(async (req, res) => {
    const { uid } = req.user;

    const queryData = [uid];

    const questionData = await execute(_getQuestionsByUserId(), queryData);

    return sendResponse(
        res,
        questionData instanceof Error ? questionData : { message: 'Question data fetched.', questionData },
        200
    )
})

module.exports = { 
    getAllQuestions,
    getUserQuestions,
    getMyQuestions
 };