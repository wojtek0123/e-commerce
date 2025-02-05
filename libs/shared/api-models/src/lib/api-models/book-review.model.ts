import { User } from './user.model';

export interface BookReview {
  id: string;
  rating: number;
  name: string;
  message?: string;
  userId: User['id'];
  createdAt: string;
  updatedAt: string;
}
