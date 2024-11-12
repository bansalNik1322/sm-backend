import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { IContentManager } from '../interface';

export type ContentManagerDocument = ContentManager & Document;

@Schema({ timestamps: true })
export class ContentManager implements IContentManager {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  metaDescription?: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  metaKeywords: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  metaTitle?: string;

  @Prop()
  deleted_at: Date;

  @Prop({ required: true, default: false })
  active: boolean;
}

export const ContentManagerSchema =
  SchemaFactory.createForClass(ContentManager);

ContentManagerSchema.methods.softDelete = async function () {
  this.deleted_at = new Date();
  await this.save();
};

ContentManagerSchema.pre(/^find/, function (next) {
  const query = this as unknown as mongoose.Query<any, Document>;

  query.where({ deleted_at: { $exists: false } });
  next();
});
