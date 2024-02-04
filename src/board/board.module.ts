import { Global, Module } from '@nestjs/common'
import { BoardGateway } from './board.gateway'
import { BoardService } from './board.service'

@Global()
@Module({
  providers: [BoardGateway, BoardService],
  exports: [BoardService],
})
export class BoardModule {}
