import { Role } from './role.model';

export interface User {
  id: string;
  email: string;
  role: Role;
  updatedAt: string;
  createdAt: string;
}
