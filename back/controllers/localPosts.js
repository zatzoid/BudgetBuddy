const LocalPost = require('../models/localPost');
const PublicPost = require('../models/publicPosts');
const { NotFoundError } = require('../utils/errorsType');
const mongoose = require('mongoose')

function successResponse(res, data, statusCode = 200) {
    return res.status(statusCode).send({ data });
};
module.exports.getUserLocalPosts = async (req, res, next) => {
    try {
        const owner = req.user._id;
        const findedPosts = await LocalPost.find({ owner: owner });
        if (!findedPosts) {
            return res.send({ message: 'постов не найдено' }).status(404)
        }
        successResponse(res, findedPosts);
    }
    catch (err) {
        return next(err);
    }
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
/* module.exports.deleteLocalPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const deletedPost = await LocalPost.findOneAndDelete(postId);
        return successResponse(res, { meessage: `Пост за ${deletedPost.choisenDate} удален` });
    }
    catch (err) {
        return next(err);
    }
}; */
// добавляет что то одно, получает {cashData. ...}
module.exports.putCashDataLocalPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const { profit, lose } = req.body.cashData;
        const postToPut = await LocalPost.findById(postId);
        if (!postToPut) {
            throw new NotFoundError('Пост не найден')
        }
        if (!lose) {
            const newProfit = { _id: new mongoose.Types.ObjectId(), ...profit };
            postToPut.cashData.profit.push(newProfit);
        }
        if (!profit) {
            const newLose = { _id: new mongoose.Types.ObjectId(), ...lose };
            postToPut.cashData.lose.push(newLose);
        }
        const updatedPost = await postToPut.save();
        return successResponse(res, { meessage: `Добавлено поле`, updatedPost });
    }
    catch (err) {
        return next(err);
    }
}

module.exports.deleteCashDataLocalPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const { profit, lose } = req.body.cashData;
        const updatedPost = await LocalPost.findById(postId);
        if (!updatedPost) {
            throw new NotFoundError('Пост не найден');
        }
        if (!lose) {
            updatedPost.cashData.profit = updatedPost.cashData.profit.filter(p => p._id.toString() !== profit._id);
        }
        if (!profit) {
            updatedPost.cashData.lose = updatedPost.cashData.lose.filter(l => l._id.toString() !== lose._id);
        }
        const savedPost = await updatedPost.save();
        return successResponse(res, { meessage: `Запись удалена`, savedPost });
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