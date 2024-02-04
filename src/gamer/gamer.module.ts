import { Global, Module } from '@nestjs/common'
import { GamerGateway } from './gamer.gateway'
import { GamerService } from './gamer.service'

@Global()
@Module({
  providers: [GamerGateway, GamerService],
  exports: [GamerService],
})
export class GamerModule {}
