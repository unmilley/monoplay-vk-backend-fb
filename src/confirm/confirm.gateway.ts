import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
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
  async create(@MessageBody() createConfirmDto: CreateConfirmDto, @ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    // const { confirm, gamerId } = await this.confirmService.create(createConfirmDto, userId);
    // this.server.emit(`getConfirm:${gamerId}`, confirm);
  }

  @SubscribeMessage('acceptConfirm')
  async accept(@MessageBody() acceptConfirmDto: AcceptConfirmDto) {
    // const room = await this.confirmService.accept(acceptConfirmDto);
    // this.server.emit(`getRoom:${acceptConfirmDto.boardId}`, room);
  }
  @SubscribeMessage('cancelConfirm')
  cancel(@MessageBody() cancelConfirmDto: CancelConfirmDto) {
    // this.confirmService.cancel(cancelConfirmDto);
  }
}
