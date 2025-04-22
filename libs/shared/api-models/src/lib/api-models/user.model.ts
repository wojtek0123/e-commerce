import { Role } from './role.model';
import { UserInformation } from './user-information.model';

export interface User {
  id: string;
  email: string;
  role: Role;
  refreshToken: string;
  updatedAt: string;
  createdAt: string;
  userInformation?: UserInformation;
}
