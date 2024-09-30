import { decode } from 'jsonwebtoken';

export const getUserIdFromAccessToken = (accessToken: string): string => {
  return String(decode(accessToken.split(' ')[1]).sub);
};
