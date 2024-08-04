import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import express, { json } from 'express';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import { RecurrenceRule, scheduleJob } from 'node-schedule';
import routes from './routes/index.js';
import { Auth } from './midlewares/auth.js';
import { errorCheker } from './midlewares/errorChecker.js';
import { signUp, signIn } from './controllers/users.js';
import { validRegister, validLogin } from './utils/validation.js';
import { emailFinder } from './utils/reminder/EmailFinder.js';
import cors from './midlewares/cors.js';
import { NotFoundError } from './utils/errorsType.js';
import { requestLogger, errorLogger } from './midlewares/logger.js';
import { checkStatus } from './controllers/status.js';
//const { limiter } = require('./midlewares/limiter')
//swagger new
import { serve, setup } from 'swagger-ui-express';
import docs from './docs/docs.js';





const { PORT = 3000, MONGODB_PORT } = process.env;

const app = express();





app.use(json());
app.use(cookieParser());
app.set('trust proxy', true);
app.use('/docs', serve, setup(docs));

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
    await connect(`mongodb://127.0.0.1:${MONGODB_PORT}/budgetbuddy`);
    app.listen(PORT, () => {
      console.log('все круто --', PORT);
    });
  } catch (error) {
    console.log(`ошибка при подключении ${error}`);
  }

}
serverUp();

/* отправка писем с делеем */
const rule = new RecurrenceRule();
rule.hour = 0;
rule.minute = 10;


const dailyTask = scheduleJob(rule, function () {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00.000+00:00`;
  const dateToFinde = new Date(formattedDate);
  emailFinder(dateToFinde);
});