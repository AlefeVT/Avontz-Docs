import { AuthenticationError, NotFoundError } from '@/app/util';
import { getEvent } from '@/data-access/events';
import { getMembership } from '@/data-access/membership';
import { UserSession } from '@/use-cases/types';
import { PublicError } from './errors';

export async function assertEventExists(eventId: number) {
  const event = await getEvent(eventId);

  if (!event) {
    throw new NotFoundError('Event not found');
  }

  return event;
}
