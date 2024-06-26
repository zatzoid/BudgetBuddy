const dotenv = require('dotenv');
const path = require('path');
const schedule = require('node-schedule');
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const { Auth } = require('./midlewares/auth');
const { errors } = require('celebrate');
const { errorCheker } = require('./midlewares/errorChecker');
const { signUp, signIn } = require('./controllers/users');
const { validRegister, validLogin } = require('./utils/validation');
const { emailFinder } = require('./utils/reminder/EmailFinder');
const cors = require('./midlewares/cors');
const NotFoundError = require('./utils/errorsType');
const { requestLogger, errorLogger } = require('./midlewares/logger');
const { checkStatus } = require('./controllers/status');
//const { limiter } = require('./midlewares/limiter')

const { PORT = 3000, MONGODB_PORT } = process.env;

const app = express();
//https
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true);
//app.use(limiter);
app.use(requestLogger);
app.use(cors);
app.post('/sign-up', validRegister, signUp);
app.post('/sign-in', validLogin, signIn);
app.get('/status', checkStatus)
app.use(Auth);
app.use('/', routes);
app.use('*', (req, res, next) => { next(new NotFoundError('nothing')); });
app.use(errorLogger);
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
serverUp();

/* отправка писем с делеем */
const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 10;


const dailyTask = schedule.scheduleJob(rule, function () {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00.000+00:00`;
  const dateToFinde = new Date(formattedDate);
  emailFinder(dateToFinde);
});