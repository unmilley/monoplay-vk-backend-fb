import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class InitUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsNotEmpty()
  @IsString()
  lastName: string

  @IsNotEmpty()
  @IsNumber()
  id: number
}
