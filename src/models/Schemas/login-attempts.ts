import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ILoginAttempt } from '../interface';

export type LoginAttemptDocument = LoginAttempt & Document;
@Schema({ timestamps: true })
export class LoginAttempt implements ILoginAttempt {
  @Prop({ required: true, ref: 'User' })
  userid: Types.ObjectId;

  @Prop({ required: true })
  ip_address: string;

  @Prop({ required: true, default: 1 })
  attempts: number;

  @Prop({ required: true, default: false })
  success: boolean;

  @Prop({ required: true, default: new Date() })
  attempted_at: Date;

  @Prop({ required: false })
  deleted_at: Date;
}

export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt);

LoginAttemptSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};
