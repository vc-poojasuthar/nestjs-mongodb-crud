import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  readonly name: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  readonly type: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
