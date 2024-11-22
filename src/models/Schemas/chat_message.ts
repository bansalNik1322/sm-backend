import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { IChatMessage } from '../interface';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: true })
export class ChatMessage implements IChatMessage {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Chat' })
  chatid: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  sender: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  message_text: string;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  })
  seen_by: mongoose.Schema.Types.ObjectId[];
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
