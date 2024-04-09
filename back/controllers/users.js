const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const localPost = require('../models/localPost');
const LPreminderData = require('../models/LPreminderData')
const { getJWT } = require('../utils/getJwt');
const { NotFoundError, RegistrError } = require('../utils/errorsType');

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
module.exports.signUp = async (req, res, next) => {
    try {
        const {
            name, email,
        } = req.body;
        const password = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            name,
            email,
            password,
        });
        const key = getJWT();
        const token = jwt.sign({ _id: newUser._id }, key, { expiresIn: '7d' });
        return res.cookie(
            'Bearer ',
            token,
            {
                maxAge: 3600000 * 24 * 7,
                httpOnly: true,
            },
        ).status(201).send({ metaData: { message: 'Вы успешно зарегистрировались' } });
    } catch (err) {
        if (err.code === 11000) {
            return next(new RegistrError('почта уже зарегистрирована'));
        }

        return next(err);
    }
};
module.exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password);
        const key = getJWT();
        const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });
        return res.cookie(
            'Bearer ',
            token,
            {
                maxAge: 3600000 * 24 * 7,
                httpOnly: true,
            },
        ).send({ metaData: { message: 'Вход в аккаунт выполнен успешно' } });
    } catch (err) { return next(err); }
};
module.exports.signOut = async (req, res, next) => {
    try {
        return res.clearCookie('Bearer').status(200).send({ metaData: { message: 'Выход из аккаунта выполнен успешно' } });
    } catch (err) { return next(err); }
};
module.exports.getUserMe = async (req, res, next) => {
    try {
        const userData = await User.findById(req.user._id);
        if (!userData) {
            throw new NotFoundError('user not found');
        }
        return successResponse(res, { metaData: { message: 'Авторизация прошла успешно' }, content: userData });
    }
    catch (err) { return next(err); }
}
module.exports.changeProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const userData = await User.findByIdAndUpdate(
            req.user._id,
            { name, email },
            { new: true, runValidators: true },
        );
        if (!userData) {
            throw new NotFoundError('user not found');
        }
        return successResponse(res, { metaData: { message: 'Данные профиля успешно изменены' }, content: userData });
    } catch (err) {
        if (err.code === 11000) {
            return next(new RegistrError('почта уже зарегистрирована'));
        }
        return next(err);
    }
};

module.exports.deleteUserMe = async (req, res, next) => {
    try {
        await localPost.deleteMany({ owner: req.user._id });
        await LPreminderData.deleteMany({ emailTo: req.body.data.email });
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            throw new NotFoundError('user not found');
        }
        return res.clearCookie('Bearer').status(200).send({ metaData: { message: `Аккаунт успешно удален.` } });
    } catch (err) {
        return next(err);
    }

}