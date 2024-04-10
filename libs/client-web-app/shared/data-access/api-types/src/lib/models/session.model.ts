import { User } from '@e-commerce/client-web-app/shared/data-access/api-types';

export interface Session {
  accessToken: string;
  user: User;
}
