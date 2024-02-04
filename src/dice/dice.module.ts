import { Global, Module } from '@nestjs/common'
import { DiceGateway } from './dice.gateway'
import { DiceService } from './dice.service'

@Global()
@Module({
  providers: [DiceGateway, DiceService],
  exports: [DiceService],
})
export class DiceModule {}
