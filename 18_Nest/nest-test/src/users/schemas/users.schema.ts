import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UsersDocument = Users & Document;

@Schema()
export class Users extends Document {
  @Prop({
    required: true,
    type: String,
  })
  username: string;
  @Prop({
    required: true,
  })
  email: string;
  @Prop({
    required: true,
    type: String,
    select: false,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(Users);
