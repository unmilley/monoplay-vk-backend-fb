import { PartialType } from '@nestjs/mapped-types'
import { Gamer } from '@types'
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator'
import { CreateGamerDto } from './create-gamer.dto'

export class UpdateGamerDto extends PartialType(CreateGamerDto) {
  gamer: Partial<Gamer>
}

export class UpdateGamerMoney {
  @IsNumber()
  @IsNotEmpty()
  room: number

  @IsNumber()
  @IsNotEmpty()
  userId: number

  @IsNumber()
  @IsNotEmpty()
  money: number
}
export class UpdateGamerBankrupt {
  @IsNumber()
  @IsNotEmpty()
  room: number

  @IsBoolean()
  leave: boolean
}
