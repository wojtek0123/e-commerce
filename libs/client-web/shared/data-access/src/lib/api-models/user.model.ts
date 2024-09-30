import { Role } from './role.model';

export interface User {
  id: string;
  email: string;
  role: Role;
  refreshToken: string;
  updatedAt: string;
  createdAt: string;
}
