import { PartialType } from '@nestjs/mapped-types'
import { IsBoolean, IsNumber, IsPositive } from 'class-validator'
import { InitUserDto } from './init-user.dto'

export class UpdateUserDto extends PartialType(InitUserDto) {
  @IsBoolean()
  useRofls?: boolean

  @IsNumber()
  @IsPositive()
  room: number
}
