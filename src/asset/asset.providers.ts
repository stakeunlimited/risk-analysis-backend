import { Mongoose } from 'mongoose';
import { AssetSchema } from './schemas/asset.schema';

export const assetProviders = [
  {
    provide: 'ASSET_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Asset', AssetSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];