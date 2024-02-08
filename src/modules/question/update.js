const asyncHandler = require("express-async-handler");
const { execute } = require("../../utils/dbConnect");
const { sendResponse } = require("../../utils/sendResponse");
const { CustomError } = require("../../middlewares/errorMiddleware");

const _updateQuestion = () => `
    UPDATE questions 
    SET 
        qtitle = ?,
        qdescription = ?,
        updatedAt = NOW()
    WHERE
        qid = ? AND uid = ?
`

const updateQuestion = asyncHandler(async (req, res) => {
    const { qtitle, qdescription } = req.body;

    if(!qtitle || !qdescription) {
        throw new CustomError('Fill all fields properly.', 400)
    }

    const { uid } = req.user;
    const { qid } = req.params;

    const queryData = [qtitle, qdescription, qid, uid]

    const updatedQuestionDetails = await execute(_updateQuestion(), queryData);

    if(!(updatedQuestionDetails.affectedRows)) {
        res.status(401);
        throw new Error("Not authorized or invalid question ID");
    }

    return sendResponse(
        res,
        updatedQuestionDetails instanceof Error
         ? 
         updatedQuestionDetails : { message: 'Question succesfully updated.', updatedQuestionData: {qid, ...req.body, uid} },
        200
    )
})

module.exports = { updateQuestion };