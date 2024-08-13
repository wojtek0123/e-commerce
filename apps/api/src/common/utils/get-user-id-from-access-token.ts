import { decode } from 'jsonwebtoken';

export const getUserIdFromAccessToken = (accessToken: string) => {
  return +decode(accessToken.split(' ')[1]).sub;
};
