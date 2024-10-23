import { Document, Types } from 'mongoose';
import { IToken } from '../interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token implements IToken {
  @Prop({ required: true })
  token_hash: string;

  @Prop({ required: true, default: false })
  deleted: boolean;

  @Prop({ required: true, deleted_at: new Date() })
  deleted_at?: Date;

  @Prop({ required: true, ref: 'User' })
  userid: Types.ObjectId;

  @Prop({ required: true })
  ip_address: string;

  @Prop({ required: true })
  device: string;
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
