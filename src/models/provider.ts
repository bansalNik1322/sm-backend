import { Connection } from 'mongoose';

import { UserSchema } from './Schemas/user';

export const USER_PROVIDER = [
  {
    provide: 'CAT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
