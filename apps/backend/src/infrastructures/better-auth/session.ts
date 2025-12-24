import { Provider } from '@di';
import { BehaviorSubject } from 'rxjs';

export const SESSION_QUEUE_SUBJECT = 'SESSION_QUEUE_SUBJECT';

export type SessionQueueSubject = BehaviorSubject<{
  endpoint: 'revoke-session' | 'revoke-sessions' | 'revoke-other-sessions';
  body: any;
  sessionToken?: string;
} | null>;

export const SessionQueueProvider: Provider<SessionQueueSubject> = {
  provide: SESSION_QUEUE_SUBJECT,
  useValue: new BehaviorSubject(null) as SessionQueueSubject,
};
