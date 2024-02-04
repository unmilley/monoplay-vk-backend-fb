import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class CreateGamerDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  room: number

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userId: number
}
