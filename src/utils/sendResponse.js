const sendResponse = (res, _data, statusCode) => {

    let response = '';

    if(_data instanceof Error) {
        response  = {
            statusCode,
            data: {
                error: _data
            }
        }
    }

    statusCode = _data.code ? 500 : statusCode;

    response  = {
        statusCode,
        data: _data,
    };

    res.status(statusCode).json(response);
}

module.exports = { sendResponse };