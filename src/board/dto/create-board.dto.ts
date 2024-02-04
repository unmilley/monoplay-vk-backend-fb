import { EDITION } from '@types'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  @IsEnum(EDITION)
  edition: EDITION
}
export class BoardRoomDto {
  @IsNotEmpty()
  @IsNumber()
  room: number
}
