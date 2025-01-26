import { decode } from 'jsonwebtoken';

export const getRoleFromAccessToken = (accessToken: string): string | null => {
  const role = decode(accessToken.split(' ').at(1))?.['role'];

  return role ?? null;
};
