import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { BoardService } from './board.service'
import { BoardRoomDto, CreateBoardDto } from './dto'

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
export class BoardGateway {
  @WebSocketServer()
  server: Server
  constructor(private readonly boardService: BoardService) {}

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() createBoardDto: CreateBoardDto, @ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    return this.boardService.createRoom(createBoardDto, userId)
  }

  @SubscribeMessage('loadRoom')
  async loadRoom(@MessageBody() loadBoardDto: BoardRoomDto, @ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    const room = await this.boardService.loadRoom(loadBoardDto.room, userId)
    if (typeof room === 'string') return room
    this.server.emit(`updateGamers:${loadBoardDto.room}`, room.gamers)
    return JSON.stringify({ ...room })
  }

  @SubscribeMessage('initRoom')
  initRoom(@ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    return this.boardService.initRoom(userId)
  }

  @SubscribeMessage('resetBoard')
  async resetBoard(@MessageBody() boardRoomDto: BoardRoomDto, @ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    const board = await this.boardService.resetBoard(boardRoomDto, userId)
    this.server.emit(`getRoom:${boardRoomDto.room}`, board)
  }

  @SubscribeMessage('deleteRoom')
  async deleteRoom(@MessageBody() boardRoomDto: BoardRoomDto) {
    await this.boardService.deleteRoom(boardRoomDto.room)
    this.server.emit(`deleteRoom:${boardRoomDto.room}`)
  }
}
