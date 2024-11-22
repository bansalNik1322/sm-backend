import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { IChatContact } from '../interface';

export type ChatContactDocument = ChatContact & Document;

@Schema({ timestamps: true })
export class ChatContact implements IChatContact {
  @Prop({
    required: true,
    unique: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  userid: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  })
  contacts: mongoose.Schema.Types.ObjectId[];
}

export const ChatContactSchema = SchemaFactory.createForClass(ChatContact);
