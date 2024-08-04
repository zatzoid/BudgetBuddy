import { Schema, model } from 'mongoose';
import validator from 'validator';
const { isEmail } = validator
import {LoginError} from '../utils/errorsType.js';
import bcryptjs from "bcryptjs";
const { compare } = bcryptjs;
const user = new Schema({
  avatar: {
    type: String,
    default: 'in progress'
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Поле name обязательно'],
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'Почта уже зарегистрирована'],
    validate: {
      validator: (value) => isEmail(value),
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
      return compare(password, user.password)
        .then((match) => {
          if (!match) {
            return Promise.reject(new LoginError('Неверная почта или пароль'));
          }
          return user;
        });
    });
};

export default model('User', user);