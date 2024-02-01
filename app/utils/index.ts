import { Types } from 'mongoose';

export const handleCheckUserId = (userId: string): boolean => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return false;
  }

  return true;
};
