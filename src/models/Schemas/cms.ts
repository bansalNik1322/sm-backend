import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop({ required: false })
  metaKeywords: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  metaTitle?: string;

  @Prop({ required: true, default: false })
  deleted: boolean;

  @Prop({ required: true, default: false })
  active: boolean;
}

export const ContentManagerSchema =
  SchemaFactory.createForClass(ContentManager);
