import { Role } from './role.model';

export interface User {
  id: number;
  email: string;
  role: Role;
  refreshToken: string;
  updatedAt: string;
  createdAt: string;
}
