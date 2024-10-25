import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IEmailTemplate } from '../interface';

export type EmailTemplateDocument = EmailTemplate & Document;

@Schema({ timestamps: true })
export class EmailTemplate implements IEmailTemplate {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  id?: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  template: string;

  @Prop({ required: true })
  subject: string;
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);
