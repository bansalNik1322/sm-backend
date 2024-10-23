import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ILockout } from '../interface';
import { IpBlockReasons } from 'src/common/constants/enum';

export type LockoutDocument = Lockout & Document;

@Schema({ timestamps: true })
export class Lockout implements ILockout {
  @Prop({ required: true })
  ip_address: string;

  @Prop({ required: true })
  lockout_time: number;

  @Prop({ required: true })
  lockout_end: Date;

  @Prop({ required: true, default: IpBlockReasons.MultipleFailedLoginAttempts })
  lockout_reason: IpBlockReasons;

  @Prop({ required: true, ref: 'User' })
  userid: Types.ObjectId;
}

export const LockoutSchema = SchemaFactory.createForClass(Lockout);

LockoutSchema.pre('save', function (next) {
  this.lockout_time = 24 * 60 * 60;
  this.lockout_end = new Date(Date.now() + this.lockout_time * 1000);

  next();
});
