const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const { Auth } = require('./midlewares/auth');
const { errors } = require('celebrate');
const {errorCheker} = require('./midlewares/errorChecker');
const { signUp, signIn } = require('./controllers/users');
const { validRegister, validLogin } = require('./utils/validation');

const { PORT = 3000, MONGODB_PORT } = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.post('/sign-up', validRegister, signUp);
app.post('/sign-in', validLogin, signIn);
app.use(Auth);
app.use('/', routes);
app.use(errors());
app.use(errorCheker);

async function serverUp() {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:${MONGODB_PORT}/budgetbuddy`);
    app.listen(PORT, () => {
      console.log('все круто --', PORT);
    });
  } catch (error) {
    console.log(`ошибка при подключении ${error}`);
  }

}
serverUp()