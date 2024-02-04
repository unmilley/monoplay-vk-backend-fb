import { PartialType } from '@nestjs/mapped-types'
import { Company, Railroad, Streets } from '@types'
import { IsArray, IsNotEmptyObject, IsNumber } from 'class-validator'
import { CreateBoardDto } from './create-board.dto'

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  id: number
}

export class UpdateBoardStreet {
  @IsNumber()
  room: number

  @IsNotEmptyObject()
  streets: Streets
}

export class UpdateBoardRailroad {
  @IsNumber()
  room: number

  @IsArray()
  railroad: Railroad[]
}

export class UpdateBoardCompanies {
  @IsNumber()
  room: number

  @IsArray()
  companies: Company[]
}
