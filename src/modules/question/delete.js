const asyncHandler = require("express-async-handler");
const { execute } = require("../../utils/dbConnect");
const { sendResponse } = require("../../utils/sendResponse");
const { CustomError } = require('../../middlewares/errorMiddleware')

const _deleteQuestion = () => `
    DELETE FROM
        questions
    WHERE
        qid = ? and uid = ?
`

const deleteQuestion = asyncHandler(async (req, res) => {
    const { qid } = req.params;
    const { uid } = req.user;
    const queryData = [qid, uid];
    const deletedQuestionDetails = await execute(_deleteQuestion(), queryData);

    if(!(deletedQuestionDetails.affectedRows)) {
        throw new CustomError("Not authorized or invalid question ID", 401);
    }

    return sendResponse(
        res,
        deletedQuestionDetails instanceof Error ? deletedQuestionDetails : { message: 'Question deleted successfully.', deletedQuestionDetails },
        200
    )
})

module.exports = { deleteQuestion };