import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class BuyDto {
  @IsString()
  @IsNotEmpty()
  path: string

  @IsNotEmpty()
  @IsNumber()
  room: number
}

export class PledgeDto extends BuyDto {}
export class RedemptionDto extends BuyDto {}

export class BuyPropertyDto {
  @IsString()
  @IsNotEmpty()
  @IsArray()
  path: string

  @IsNotEmpty()
  @IsNumber()
  room: number

  @IsBoolean()
  isBuy: boolean
}
