import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { IFaq } from '../interface';

export type FaqDocument = Faq & Document;

@Schema({ timestamps: true })
export class Faq implements IFaq {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;

  @Prop()
  deleted_at: Date;

  @Prop({ required: false, default: false })
  status: boolean;
}

export const FaqSchema = SchemaFactory.createForClass(Faq);

FaqSchema.methods.softDelete = async function () {
  this.deleted_at = new Date();
  await this.save();
};

FaqSchema.pre(/^find/, function (next) {
  const query = this as unknown as mongoose.Query<any, Document>;

  query.where({ deleted_at: { $exists: false } });
  next();
});
