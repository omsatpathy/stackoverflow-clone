const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const { userRouter } = require('./modules/user/userRouter');
const { questionRouter } = require('./modules/question/questionRouter');
const { answerRouter } = require('./modules/answer/answerRouter');
const { commentRouter } = require('./modules/comment/commentRouter');
const { searchRouter } = require('./modules/search/searchRouter');

const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// helper middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routers
app.use('/v1', userRouter);
app.use('/v1', questionRouter);
app.use('/v1', answerRouter);
app.use('/v1', commentRouter);
app.use('/v1', searchRouter);

// error handler middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Server running at port ", PORT);
    }
})