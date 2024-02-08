const asyncHandler = require("express-async-handler");

const { execute } = require("../../utils/dbConnect");
const { CustomError } = require('../../middlewares/errorMiddleware')

const _getCommentUid = () => `
    SELECT
        uid
    FROM
        comments
    WHERE
        cid = ?
`

const _deleteCommentByCommentOwner = () => `
    DELETE FROM
        comments
    WHERE
        cid = ? and uid = ?
`

const _getCommentQid = () => `
    SELECT 
        q.uid
    FROM
        comments c
            JOIN
        answers a
            JOIN
        questions q ON c.aid = a.aid AND a.qid = q.qid
    WHERE
        c.cid = ?
    GROUP BY 
        (q.uid);
`

const _deleteCommentByQuestionOwner = () => `
    DELETE FROM
        comments
    WHERE
        cid = ?
`

const deleteCommentByCommentOwner = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const { uid } = req.user;
    const getCommentUidQueryData = [cid];
    const commentUid = await execute(_getCommentUid(), getCommentUidQueryData);

    if(commentUid instanceof Error) {
        throw new CustomError(resultArr1, 400);
    }

    const commentOwnerId = commentUid[0].uid;
    if(commentOwnerId !== uid) {
        throw new CustomError("Not authorized to delete.", 400)
    }

    const deleteCommentByCommentOwnerQueryData = [cid, uid];
    const deletedCommentDetails = await execute(_deleteCommentByCommentOwner(), deleteCommentByCommentOwnerQueryData);

    return sendResponse(
        res,
        deletedCommentDetails instanceof Error ? deletedCommentDetails : {message: 'Comment succesfully deleted.', commentData: deletedCommentDetails},
        200
    )
});

const deleteCommentByQuestionOwner = asyncHandler(async (req, res) => {
    const { cid, aid } = req.params;
    const { uid } = req.user;
    const getCommentQidQueryData = [cid]
    const commentQid = await execute(_getCommentQid(), getCommentQidQueryData);

    // return console.log(commentQid);
    if(commentQid instanceof Error) {
        throw new CustomError(commentQid, 400);
    }

    const quesOwnerId = commentQid[0].uid;
    if(quesOwnerId !== uid) {
        throw new CustomError("Not authorized to delete.", 400)
    }

    const deleteCommentByQuestionOwnerQueryData = [cid];
    const deletedCommentDetails = await execute(_deleteCommentByQuestionOwner(), deleteCommentByQuestionOwnerQueryData);

    return sendResponse(
        res,
        deletedCommentDetails instanceof Error ? deletedCommentDetails : {message: 'Comment succesfully deleted.', commentData: deletedCommentDetails},
        200
    )
});

module.exports = {
    deleteCommentByCommentOwner,
    deleteCommentByQuestionOwner
};