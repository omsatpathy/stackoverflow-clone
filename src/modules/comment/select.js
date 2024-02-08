const asyncHandler = require("express-async-handler");
const { execute } = require('../../utils/dbConnect')

const _getAllComments = () => `
    SELECT 
        cid as commentId,
        ctext as commentText,
        aid as answerId,
        uid as userId,
        createdAt,
        updatedAt
    FROM
        comments
`

const _getCommentsByUserId = () => `
    SELECT 
        cid as commentId,
        ctext as commentText,
        aid as answerId,
        uid as userId,
        createdAt,
        updatedAt
    FROM
        comments
    WHERE 
        uid = ?
`

const _getCommentsForAnAnswer = () => `
    SELECT 
        cid as commentId,
        ctext as commentText,
        aid as answerId,
        uid as userId,
        createdAt,
        updatedAt
    FROM
        comments
    WHERE 
        aid = ?
`

const getAllComments = asyncHandler(async (req, res) => {

    const allCommentsData = await execute(_getAllComments());

    return sendResponse(
        res,
        allCommentsData instanceof Error ? allCommentsData : {message: 'Comments data fetched.', commentData: allCommentsData},
        200
    )

})

const getUserComments = asyncHandler(async (req, res) => {
    const uid = req.params.uid;

    const queryData = [uid];
    const userCommentsData = await execute(_getCommentsByUserId(), queryData);

    return sendResponse(
        res,
        userCommentsData instanceof Error ? userCommentsData : {message: 'Comments data fetched.', commentData: userCommentsData},
        200
    )
})

const getMyComments = asyncHandler(async (req, res) => {
    const { uid } = req.user;
    const queryData = [uid];
    const loggedInUserCommentsData = await execute(_getCommentsByUserId(), queryData);

    return sendResponse(
        res,
        loggedInUserCommentsData instanceof Error ? loggedInUserCommentsData : {message: 'Comments data fetched.', commentData: loggedInUserCommentsData},
        200
    )
})

const getAnswerComments = asyncHandler(async (req, res) => {
    const { aid } = req.params;
    const queryData = [aid];
    const commentsForAnAnswerData = await execute(_getCommentsForAnAnswer(), queryData);

    return sendResponse(
        res,
        commentsForAnAnswerData instanceof Error ? commentsForAnAnswerData : {message: 'Comments data fetched.', commentData: commentsForAnAnswerData},
        200
    )
})

module.exports = { 
    getAllComments,
    getMyComments,
    getUserComments,
    getAnswerComments
 };