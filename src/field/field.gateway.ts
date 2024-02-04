import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { BuyDto, BuyPropertyDto } from './dto'
import { FieldService } from './field.service'

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
@WebSocketGateway()
export class FieldGateway {
  @WebSocketServer()
  server: Server
  constructor(private readonly fieldService: FieldService) {}

  @SubscribeMessage('buy:streets')
  async buyStreets(@MessageBody() buyDto: BuyDto, @ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    const { streets, name } = await this.fieldService.buyStreets(buyDto, userId)
    this.server.emit(`updateStreets:${buyDto.room}`, streets)
    return name
  }

  @SubscribeMessage('buy:railroads')
  async buyRailroad(@MessageBody() buyDto: BuyDto, @ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    const { railroads, name } = await this.fieldService.buyRailroad(buyDto, userId)
    this.server.emit(`updateRailroads:${buyDto.room}`, railroads)
    return name
  }

  @SubscribeMessage('buy:companies')
  async buyCompany(@MessageBody() buyDto: BuyDto, @ConnectedSocket() client: Socket) {
    const userId = +client.handshake.auth['id']
    const { companies, name } = await this.fieldService.buyCompany(buyDto, userId)
    this.server.emit(`updateCompanies:${buyDto.room}`, companies)
    return name
  }

  @SubscribeMessage('update:property')
  async buyProperty(@MessageBody() buyPropertyDto: BuyPropertyDto) {
    const { streets, name } = await this.fieldService.changeProperty(buyPropertyDto)
    this.server.emit(`updateStreets:${buyPropertyDto.room}`, streets)
    return name
  }
  // @SubscribeMessage('sell:property')
  // async sellProperty(@MessageBody() buyPropertyDto: BuyPropertyDto) {
  //   const { streets, name } = await this.fieldService.changeProperty(buyPropertyDto, false);
  //   this.server.emit(`updateStreets:${buyPropertyDto.room}`, streets);
  //   return name;
  // }
}
