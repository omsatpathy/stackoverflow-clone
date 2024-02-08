const asyncHandler = require("express-async-handler");
const { execute } = require("../../utils/dbConnect");
const {sendResponse} = require('../../utils/sendResponse');
const { CustomError } = require("../../middlewares/errorMiddleware");

const _updateComment = () => `
    UPDATE
        comments
    SET 
        ctext = ?, 
        updatedAt = now()
    WHERE
        cid = ? and uid = ?
`

const updateComment = asyncHandler(async (req, res) => {
    const { ctext } = req.body;

    if(!ctext) {
        throw new CustomError('Fill all fields properly.', 400)
    }

    const { uid } = req.user;
    const { cid } = req.params;

    const queryData = [ctext, cid, uid];
    const updatedCommentData = await execute(_updateComment(), queryData);

    if(!(resultArr[0].affectedRows)) {
        res.status(401);
        throw new Error("Not authroized or invalid question ID");
    }

    return sendResponse(
        res,
        updatedCommentData instanceof Error ? updatedCommentData : {message: 'Comment successfully updated.', commentData: updatedCommentData},
        200
    )
})

module.exports = { updateComment };