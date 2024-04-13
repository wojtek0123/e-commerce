import { User } from './user.model';

export interface Session {
  tokens: Token;
  user: User;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}
