import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDTO {
  @IsNotEmpty()
  @IsString()
  chat_type: 'single' | 'group';

  @IsNotEmpty()
  @ArrayNotEmpty()
  participants: string[];
}
