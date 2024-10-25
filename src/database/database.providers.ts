import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb+srv://misha:NfmI3TgVkxF0lskU@risk-analysis-db.nk0vj.mongodb.net/?retryWrites=true&w=majority&appName=risk-analysis-db'),
  },
];