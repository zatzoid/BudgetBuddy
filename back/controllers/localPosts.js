const LocalPost = require('../models/localPost');
const PublicPost = require('../models/publicPosts');

function successResponse(res, data, statusCode = 200) {
    return res.status(statusCode).send({ data });
};

module.exports.createLocalPost = async (req, res, next) => {
    try {
        const { cashData, choisenDate } = req.body;
        const owner = req.user._id;
        const newPost = await LocalPost.create({ cashData, choisenDate, owner });
        return successResponse(res, newPost);
    }
    catch (err) {
        return next(err);
    }

};
module.exports.deleteLocalPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const deletedPost = await LocalPost.findOneAndDelete(postId);
        return successResponse(res, { meessage: `Пост за ${deletedPost.choisenDate} удален` });
    }
    catch (err) {
        return next(err);
    }
};

module.exports.changeLocalPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const { profit, lose } = req.body.cashData;
        const updatedPost = await LocalPost.findByIdAndUpdate(postId, {
            $set: {
                'cashData.profit': profit,
                'cashData.lose': lose
            }
        }, { new: true });
        return successResponse(res, { meessage: `Пост обновлен`, updatedPost });
    }
    catch (err) {
        return next(err);
    }
};

module.exports.uploadLocalPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const updatedPost = await LocalPost.findByIdAndUpdate(postId, { posted: true }, { new: true });
        const { cashData, owner, choisenDate } = updatedPost;
        const uploadPost = await PublicPost.create({ cashData, owner, choisenDate });
        return successResponse(res, { message: 'Запись опубликована', uploadPost })
    }
    catch (err) {
        return next(err);
    }
};