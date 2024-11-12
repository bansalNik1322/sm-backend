import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { IEmailTemplate } from '../interface';

export type EmailTemplateDocument = EmailTemplate & Document;

@Schema({ timestamps: true })
export class EmailTemplate implements IEmailTemplate {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  template: string;

  @Prop({ required: true })
  subject: string;

  @Prop()
  deleted_at: Date;
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);

EmailTemplateSchema.methods.softDelete = async function () {
  this.deleted_at = new Date();
  await this.save();
};

EmailTemplateSchema.pre(/^find/, function (next) {
  const query = this as unknown as mongoose.Query<any, Document>;

  query.where({ deleted_at: { $exists: false } });
  next();
});
