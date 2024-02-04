import { BoardService } from '@board/board.service'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { CreateGamerDto, UpdateGamerBankrupt, UpdateGamerMoney } from './dto'
import { GamerService } from './gamer.service'

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
export class GamerGateway {
  @WebSocketServer()
  server: Server
  constructor(
    private readonly gamerService: GamerService,
    private readonly boardService: BoardService,
  ) {}

  @SubscribeMessage('createGamer')
  async create(@MessageBody() createGamerDto: CreateGamerDto) {
    const gamers = await this.gamerService.createGamer(createGamerDto)
    this.server.emit(`updateGamers:${createGamerDto.room}`, gamers)
    return gamers
  }

  @SubscribeMessage('update:money')
  async updateMoney(@MessageBody() updateGamerMoney: UpdateGamerMoney) {
    const { room, gamers } = await this.gamerService.updateMoney(updateGamerMoney)
    this.server.emit(`updateGamers:${room}`, gamers)
  }

  @SubscribeMessage('update:bankrupt')
  async updateBankrupt(@MessageBody() updateGamerBankrupt: UpdateGamerBankrupt, @ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    await this.gamerService.updateBankrupt(updateGamerBankrupt, userId)
    const board = await this.boardService.initRoomByRoom(updateGamerBankrupt.room, false)
    client.broadcast.emit(`getRoom:${updateGamerBankrupt.room}`, JSON.stringify(board))
  }
}
