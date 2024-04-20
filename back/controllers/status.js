const LocalPost = require('../models/localPost');


function successResponse(res, data) {
    const statusCode = data.metaData.statusCode ? data.metaData.statusCode : 200
    if (!data.metaData.statusCode) {
        data.metaData.statusCode
        data.metaData.statusCode = statusCode
    }
    if (!data.content) {
        data.content
        data.content = null
    }
    return res.status(statusCode).send(data);
};

module.exports.checkStatus = async (req, res, next) => {
    try {
       
       await LocalPost.find();
        successResponse(res, { metaData: { message: `Все работает` , statusCode: 200} });
    }
    catch (err) {
        return next(err);
    }
};