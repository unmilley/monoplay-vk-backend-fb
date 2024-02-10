import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { ConfirmService } from './confirm.service'
import { AcceptConfirmDto, CancelConfirmDto, CreateConfirmDto } from './dto'

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
@WebSocketGateway()
export class ConfirmGateway {
  @WebSocketServer()
  server: Server
  constructor(private readonly confirmService: ConfirmService) {}

  @SubscribeMessage('createConfirm')
  async create(@MessageBody() createConfirmDto: CreateConfirmDto) {
    const { confirm, gamerId } = await this.confirmService.create(createConfirmDto)
    this.server.emit(`getConfirm:${gamerId}`, confirm)
  }

  @SubscribeMessage('acceptConfirm')
  async accept(@MessageBody() acceptConfirmDto: AcceptConfirmDto) {
    const room = await this.confirmService.accept(acceptConfirmDto)
    this.server.emit(`getRoom:${acceptConfirmDto.room}`, room)
  }
  @SubscribeMessage('cancelConfirm')
  cancel(@MessageBody() cancelConfirmDto: CancelConfirmDto) {
    this.confirmService.cancel(cancelConfirmDto)
  }
}
