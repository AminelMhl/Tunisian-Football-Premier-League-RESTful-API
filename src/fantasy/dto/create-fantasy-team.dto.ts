import { ArrayMaxSize, IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFantasyTeamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMaxSize(11)
  playerIds: number[]; 
}

export class AddPlayerDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  playerId: number;
}