const mongoose = require('mongoose');
const validator = require('validator');
const { LoginError } = require('../utils/errorsType');

const user = new mongoose.Schema({
  avatar: {
    type: String,
    default: 'in progress'
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'лох',
  },
  email: {
    type: String,
    required: [true, 'Поле "email" обязательно'],
    unique: [true, 'Почта уже зарегистрирована'],
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" обязательно'],
    select: false,
  },
}, { versionKey: false });

user.statics.login = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new LoginError('Неверная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return Promise.reject(new LoginError('Неверная почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('User', user);