const APP_SECRET = 'MP-is-aw3some';
import jwt from 'jsonwebtoken';

export const createToken = (
  email: string,
  password: string,
  userId: string,
  gender: string
) => {
  return jwt.sign({ email, password, id: userId, gender }, APP_SECRET);
};
