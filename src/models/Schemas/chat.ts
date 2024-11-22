import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { IChat } from '../interface';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat implements IChat {
  @Prop({ required: true, type: String, default: false })
  chat_type: 'single' | 'group';

  @Prop({
    required: false,
    unique: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  participants: mongoose.Schema.Types.ObjectId[];

  @Prop()
  group_name: string;

  @Prop()
  creator: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.set('toJSON', { virtuals: true });
ChatSchema.set('toObject', { virtuals: true });

ChatSchema.virtual('messages', {
  ref: 'ChatMessage',
  localField: '_id',
  foreignField: 'chatid',
});
