const joi = require('joi');
const { CustomError } = require('./errorMiddleware');

const userSchema = joi.object({
    uid: joi.string().id().min(4).required(),
    uemail: joi.string().email().max(20).required(),
    uname: joi.string().min(2).max(50).required()
});

const questionSchema = joi.object({
	qid: joi.string().id().min(4).required(),
    qtitle: joi.string().max(100).required(),
    qdescription: joi.string().max(200),
});

const answerSchema = joi.object({
    aid: joi.number().id().min(1).required(),
    atext: joi.string().max(500).required(),
	qid: joi.string().id().min(4).required()
});

const commentSchema = joi.object({
    cid: joi.number().id().min(1).required(),
    ctext: joi.string().max(200).required(),
    aid: joi.number().id().min(1).required(),
});

const validateUser = (req, res, next) => {
    const { value, error } = userSchema.validate(req.body)

    if(error) {
        throw new CustomError(error.message, 403);
    }

    req.validatedUserData = value;
    next();
}

const validateQuestion = (req, res, next) => {
    const { value, error } = questionSchema.validate(req.body)

    if(error) {
        throw new CustomError(error.message, 403);
    }

    req.validatedQuestionData = value;
    next();
}

const validateAnswer = (req, res, next) => {
    const { value, error } = answerSchema.validate(req.body)

    if(error) {
        throw new CustomError(error.message, 403);
    }

    req.validatedAnswerData = value;
    next();
}

const validateComment = (req, res, next) => {
    const { value, error } = commentSchema.validate(req.body)

    if(error) {
        throw new CustomError(error.message, 403);
    }

    req.validatedCommentData = value;
    next();
}

module.exports = {
    validateUser,
    validateQuestion,
    validateAnswer,
    validateComment
};