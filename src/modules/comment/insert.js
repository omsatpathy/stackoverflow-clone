const asyncHandler = require("express-async-handler");
const { execute } = require("../../utils/dbConnect");
const { CustomError } = require("../../middlewares/errorMiddleware");

const _insertComment = () => `
    INSERT INTO
        comments
    VALUES (?, ?, ?, ?, now(), now())
`

const insertComment = asyncHandler(async (req, res) => {
    const { cid, ctext, aid } = req.body;

    if(!cid || !ctext || !aid) {
        throw new CustomError('Fill all fields properly.', 400)
    }
    const { uid } = req.user;

    const queryData = [cid, ctext, aid, uid];
    const insertedCommentDetails = await execute(_insertComment(), queryData);

    return sendResponse(
        res,
        insertedCommentDetails,
        200
    )
})

module.exports = { insertComment };