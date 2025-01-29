import { User } from './user.model';

export interface BookReview {
  id: string;
  rating: number;
  name: string;
  message?: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}
