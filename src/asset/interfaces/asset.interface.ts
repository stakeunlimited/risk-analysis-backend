import { Document } from 'mongoose';

export interface Asset extends Document {
  readonly symbol: string;
  readonly tvl: number;
  readonly date: string;
}