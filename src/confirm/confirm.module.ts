import { Global, Module } from '@nestjs/common'
import { ConfirmGateway } from './confirm.gateway'
import { ConfirmService } from './confirm.service'

@Global()
@Module({
  providers: [ConfirmGateway, ConfirmService],
  exports: [ConfirmService],
})
export class ConfirmModule {}
