import { PartialType } from '@nestjs/mapped-types'
import { Company, Railroad, Street } from '@types'
import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString } from 'class-validator'
import { CreateBoardDto } from './create-board.dto'

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  id: number
}

export class UpdateBoardStreet {
  @IsString()
  @IsNotEmpty()
  path: string

  @IsNumber()
  room: number

  @IsObject()
  @IsNotEmptyObject()
  street: Partial<Street>
}

export class UpdateBoardRailroad {
  @IsString()
  @IsNotEmpty()
  path: string

  @IsNumber()
  room: number

  @IsObject()
  @IsNotEmptyObject()
  railroad: Partial<Railroad>
}

export class UpdateBoardCompanies {
  @IsString()
  @IsNotEmpty()
  path: string

  @IsNumber()
  room: number

  @IsObject()
  @IsNotEmptyObject()
  companies: Partial<Company>
}
