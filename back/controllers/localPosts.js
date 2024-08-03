const LocalPost = require('../models/localPost');
const LPreminderData = require('../models/LPreminderData')
const PublicPost = require('../models/publicPosts');
const { NotFoundError } = require('../utils/errorsType');
const mongoose = require('mongoose');


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


module.exports.getUserLocalPosts = async (req, res, next) => {
    try {
        const owner = req.user._id;
        const findedPosts = await LocalPost.find({ owner: owner });
        if (!findedPosts) {
           throw new NotFoundError('постов не найдено')
        }
        successResponse(res, { metaData: { message: `загружено ${findedPosts.length} постов` }, content: findedPosts });
    }
    catch (err) {
        return next(err);
    }
};


module.exports.createLocalPost = async (req, res, next) => {
    try {
        const { choisenMonth, choisenYear } = req.body;
        const owner = req.user._id;
        const newPost = await LocalPost.create({ choisenMonth, choisenYear, owner });
        return successResponse(res, { metaData: { message: `Создан пост. Месяц: ${choisenMonth}. Год: ${choisenYear}`, statusCode: 201 }, content: newPost });
    }
    catch (err) {
        return next(err);
    }

};


// добавляет что то одно, получает {cashData. ...}
module.exports.putCashDataLocalPost = async (req, res, next) => {

    try {

        const postId = req.params.postId;
        const postToPut = await LocalPost.findById(postId);
        if (!postToPut) {
            throw new NotFoundError('Пост не найден')
        }
        if (!req.body.cashData.lose) {
            const profit = req.body.cashData.profit;
            const newProfit = { _id: new mongoose.Types.ObjectId(), emailStatus: null, postId: postId, category: profit.category, ...profit };
            postToPut.cashData.profit.push(newProfit);
        }
        if (!req.body.cashData.profit) {
            const lose = req.body.cashData.lose;
            const newLose = { _id: new mongoose.Types.ObjectId(), emailStatus: null, postId: postId, category: lose.category, ...lose };
            postToPut.cashData.lose.push(newLose);
        }
        const updatedPost = await postToPut.save();
        return successResponse(res, { metaData: { message: `Добавлено поле`, statusCode: 201 }, content: updatedPost });
    }
    catch (err) {
        return next(err);
    }

}


module.exports.deleteCashDataLocalPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const postToDel = await LocalPost.findById(postId);
        if (!postToDel) {
            throw new NotFoundError('Пост не найден');
        }
        if (!req.body.cashData.lose) {
            const { profit } = req.body.cashData;
            postToDel.cashData.profit = postToDel.cashData.profit.filter(p => p._id.toString() !== profit._id);
            await LPreminderData.findOneAndDelete({ originalCashDataId: profit._id });
        }
        if (!req.body.cashData.profit) {
            const { lose } = req.body.cashData;
            postToDel.cashData.lose = postToDel.cashData.lose.filter(l => l._id.toString() !== lose._id);
            await LPreminderData.findOneAndDelete({ originalCashDataId: lose._id });
        }
        const updatedPost = await postToDel.save();
        return successResponse(res, { metaData: { meessage: `Запись удалена`, statusCode: 201 }, content: updatedPost });

    }
    catch (err) {
        return next(err);
    }
};


module.exports.patchCashDataLP = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const postToUpdate = await LocalPost.findById(postId);
        if (!postToUpdate) {
            throw new NotFoundError('Пост не найден');
        }
        if (!req.body.data.cashData.lose) {
            const { profit } = req.body.data.cashData;
            const profitIndex = postToUpdate.cashData.profit.findIndex(p => p._id.toString() === profit._id);
            if (profitIndex !== -1) {
                postToUpdate.cashData.profit[profitIndex] = profit;
            } else {
                throw new NotFoundError('Profit объект не найден');
            }

        }
        if (!req.body.data.cashData.profit) {
            const { lose } = req.body.data.cashData;
            const loseIndex = postToUpdate.cashData.lose.findIndex(l => l._id.toString() === lose._id);
            if (loseIndex !== -1) {
                postToUpdate.cashData.lose[loseIndex] = lose;
            } else {
                throw new NotFoundError('Lose объект не найден');
            }

        }
        const updatedPost = await postToUpdate.save();
        return successResponse(res, { metaData: { meessage: `Статус обновлен`, statusCode: 201 }, content: updatedPost });
    }
    catch (err) {
        return next(err)
    }
}


//не нужно
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