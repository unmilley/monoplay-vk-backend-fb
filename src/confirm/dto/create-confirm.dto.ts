import { Confirm } from '@types'
import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject } from 'class-validator'

export class CreateConfirmDto {
  @IsObject()
  @IsNotEmptyObject()
  orderBy: Confirm

  @IsObject()
  @IsNotEmptyObject()
  orderFor: Confirm

  @IsNumber()
  @IsNotEmpty()
  room: number
}

export class AcceptConfirmDto {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsNumber()
  @IsNotEmpty()
  room: number
}
export class CancelConfirmDto extends AcceptConfirmDto {}
