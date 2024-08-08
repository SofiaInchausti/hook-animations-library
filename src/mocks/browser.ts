
import { handlers } from './handler';
import { setupServer } from 'msw/node';

export const worker = setupServer(...handlers);
