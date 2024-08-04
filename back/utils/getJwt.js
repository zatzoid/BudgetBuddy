import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });


const { NODE_ENV, JWT_SECRET } = process.env;

export function getJWT () {
  return NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
}