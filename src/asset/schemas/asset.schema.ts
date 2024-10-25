import * as mongoose from 'mongoose';

export const AssetSchema = new mongoose.Schema({
  symbol: String,
  tvl: Number,
  date: String,
});