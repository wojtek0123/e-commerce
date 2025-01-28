import { User } from './user.model';

export interface BookReview {
  id: string;
  rating: number;
  message?: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}
