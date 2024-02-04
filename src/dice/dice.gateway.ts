import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { DiceService } from './dice.service'

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
export class DiceGateway {
  @WebSocketServer()
  server: Server
  constructor(private readonly diceService: DiceService) {}

  @SubscribeMessage('addDice')
  async addDice(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    const { room, users } = await this.diceService.addDice(id, userId)
    this.server.emit(`updateDice:${room}`, users)
  }

  @SubscribeMessage('removeDice')
  async removeDice(@ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    const { room, users } = await this.diceService.removeDice(userId)
    this.server.emit(`updateDice:${room}`, users)
  }

  @SubscribeMessage('reloadDice')
  async reloadDice(@ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    const { room, users } = await this.diceService.reloadDice(userId)
    this.server.emit(`updateDice:${room}`, users)
  }
}
