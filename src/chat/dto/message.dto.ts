import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
  @IsDate()
  @IsNotEmpty()
  timestamp: Date;

  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  receiver: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
