import { TokenSchema } from './Schemas/token';
import { UserSchema } from './Schemas/user';
import { LockoutSchema } from './Schemas/lockout';
import { LoginAttemptSchema } from './Schemas/login-attempts';
import { EmailTemplateSchema } from './Schemas/email-template';
import { ContentManagerSchema } from './Schemas/cms';

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
  {
    name: 'EmailTemplate',
    schema: EmailTemplateSchema,
  },
  {
    name: 'ContentManager',
    schema: ContentManagerSchema,
  },
];
