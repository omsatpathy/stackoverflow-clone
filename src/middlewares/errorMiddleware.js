const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        // sendResponse(
        //     res, 
        //     {message : err.message, stack : err.stack}, 
        //     err.statusCode
        // );
        res.json({
            error: {message: err.message, stack: err.stack},
            statusCode: err.statusCode
        })
    } else {
        // Handle other types of errors or pass them to the default error handler
        next(err);
    }
};



//   const errorHandler2 = (err, req, res, next) => {
//     const statusCode = res.statusCode === 200  ? res.statusCode : 500;
//     const errMessage = err.message ? err.message : "Something\'s wrong";

//     sendResponse(
//         res, 
//         {message : errMessage, stack : err.stack}, 
//         statusCode
//     );

// }


module.exports = {
    notFoundHandler,
    CustomError,
    errorHandler,
}