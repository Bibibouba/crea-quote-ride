
import { Quote } from '@/types/quote';

const VALID_STATUSES = ['pending', 'accepted', 'declined', 'rejected', 'expired'] as const;
type ValidStatus = typeof VALID_STATUSES[number];

export const validateQuoteStatus = (status: string): Quote['status'] => {
  return VALID_STATUSES.includes(status as ValidStatus) 
    ? (status as Quote['status'])
    : 'pending';
};
