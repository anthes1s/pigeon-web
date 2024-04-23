import { IsString, IsNotEmpty } from 'class-validator';

export class FavoritesDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
