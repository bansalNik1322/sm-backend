import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IToken } from '../interface';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token implements IToken {
  @Prop({ required: true })
  access_token_hash: string;

  @Prop({ required: true })
  refresh_token_hash: string;

  @Prop({ required: true, default: false })
  deleted: boolean;

  @Prop({ required: true, deleted_at: new Date() })
  deleted_at?: Date;

  @Prop({ required: true, ref: 'User' })
  userid: Types.ObjectId;

  @Prop({ required: true })
  ip_address: string;

  @Prop({ required: true, default: 'android' })
  device: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.methods.softDelete = function () {
  this.deleted = true;
  this.deletedAt = new Date();
  return this.save();
};

TokenSchema.methods.restoreRecord = function () {
  this.deleted = false;
  this.deletedAt = null;
  return this.save();
};
