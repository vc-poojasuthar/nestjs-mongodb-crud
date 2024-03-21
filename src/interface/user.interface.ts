import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly name: string;
  email: string;
  password: string;
  readonly type: string;
}
