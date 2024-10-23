import { TokenSchema } from './Schemas/token';
import { UserSchema } from './Schemas/user';
import { LockoutSchema } from './Schemas/lockout';
import { LoginAttemptSchema } from './Schemas/login-attempts';

export const models = [
  {
    name: 'User',
    schema: UserSchema,
  },
  {
    name: 'Token',
    schema: TokenSchema,
  },
  {
    name: 'Lockout',
    schema: LockoutSchema,
  },
  {
    name: 'LoginAttempts',
    schema: LoginAttemptSchema,
  },
];
