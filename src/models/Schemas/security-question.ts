import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { ISecurityQuestion } from '../interface';

export type SecurityQuestionDocument = SecurityQuestion & Document;

@Schema({ timestamps: true })
export class SecurityQuestion implements ISecurityQuestion {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true, default: true })
  status: boolean;

  @Prop()
  deleted_at: Date;

  @Prop({ required: true, default: [] })
  user_assigned: string[];
}

export const SecurityQuestionSchema =
  SchemaFactory.createForClass(SecurityQuestion);

SecurityQuestionSchema.methods.softDelete = async function () {
  this.deleted_at = new Date();
  await this.save();
};

SecurityQuestionSchema.pre(/^find/, function (next) {
  const query = this as unknown as mongoose.Query<any, Document>;

  query.where({ deleted_at: { $exists: false } });
  next();
});
