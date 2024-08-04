import LocalPost from '../models/localPost.js';
import LPreminderData from '../models/LPreminderData.js';
import { NotFoundError } from '../utils/errorsType.js';
import { Types } from 'mongoose';


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


export async function getUserLocalPosts(req, res, next) {
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
}


export async function createLocalPost(req, res, next) {
    try {
        const { choisenMonth, choisenYear } = req.body;
        const owner = req.user._id;
        const newPost = await LocalPost.create({ choisenMonth, choisenYear, owner });
        return successResponse(res, { metaData: { message: `Создан пост. Месяц: ${choisenMonth}. Год: ${choisenYear}`, statusCode: 201 }, content: newPost });
    }
    catch (err) {
        return next(err);
    }

}


// добавляет что то одно, получает {cashData. ...}
export async function putCashDataLocalPost(req, res, next) {

    try {

        const postId = req.params.postId;
        const postToPut = await LocalPost.findById(postId);
        if (!postToPut) {
            throw new NotFoundError('Пост не найден')
        }
        if (!req.body.cashData.lose) {
            const profit = req.body.cashData.profit;
            const newProfit = { _id: new Types.ObjectId(), emailStatus: null, postId: postId, category: profit.category, ...profit };
            postToPut.cashData.profit.push(newProfit);
        }
        if (!req.body.cashData.profit) {
            const lose = req.body.cashData.lose;
            const newLose = { _id: new Types.ObjectId(), emailStatus: null, postId: postId, category: lose.category, ...lose };
            postToPut.cashData.lose.push(newLose);
        }
        const updatedPost = await postToPut.save();
        return successResponse(res, { metaData: { message: `Добавлено поле`, statusCode: 201 }, content: updatedPost });
    }
    catch (err) {
        return next(err);
    }

}


export async function deleteCashDataLocalPost(req, res, next) {
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
}


export async function patchCashDataLP(req, res, next) {
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


export async function createEmailDataToSend(req, res, next) {
    try {
        console.log(req.body)
        const { date, mainData, message, emailTo } = req.body.data;
        const dateToSend = date;
        const { _id, postId } = mainData;
        const dataReminder = await LPreminderData.create({ dateToSend, mainData, message, emailTo });
        const updatedPost = await localPost.findOne({ _id: postId });
        if (updatedPost) {
            const targetElementId = _id;
            const cashData = updatedPost.cashData;
            const profitIndex = cashData.profit.findIndex(
                (profitElement) => profitElement._id.toString() === targetElementId);
            const loseIndex = cashData.lose.findIndex(
                (loseElement) => loseElement._id.toString() === targetElementId);

            if (profitIndex !== -1) {
                cashData.profit[profitIndex].reminde = { status: 'added', data: { dateToSend: dateToSend, reminderId: dataReminder._id, message: dataReminder.message } };

            }
            else if (loseIndex !== -1) {
                cashData.lose[loseIndex].reminde = { status: 'added', data: { dateToSend: dateToSend, reminderId: dataReminder._id, message: dataReminder.message } };

            }

            await updatedPost.save();
        }
        return res.status(200).send({ metaData: { message: `Писмьо придет на почту ${emailTo}, ${dateToSend} в 1:00 по МСК`, statusCode: 200 }, content: updatedPost })
    }
    catch (e) { return next(e) }
}