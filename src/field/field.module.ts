import { Global, Module } from '@nestjs/common'
import { FieldGateway } from './field.gateway'
import { FieldService } from './field.service'

@Global()
@Module({
  providers: [FieldGateway, FieldService],
  exports: [FieldService],
})
export class FieldModule {}
