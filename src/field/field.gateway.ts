import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { BuyDto, BuyPropertyDto, type PledgeDto, type RedemptionDto } from './dto'
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
  @SubscribeMessage('pledge:streets')
  async pledgeStreets(@MessageBody() pledgeDto: PledgeDto) {
    const { streets, name, fold } = await this.fieldService.pledgeStreet(pledgeDto)
    this.server.emit(`updateStreets:${pledgeDto.room}`, streets)
    return { name, fold }
  }

  @SubscribeMessage('pledge:railroads')
  async pledgeRailroad(@MessageBody() pledgeDto: PledgeDto) {
    const { railroads, name } = await this.fieldService.onPledgeRailroad(pledgeDto, true)
    this.server.emit(`updateRailroads:${pledgeDto.room}`, railroads)
    return { name }
  }

  @SubscribeMessage('pledge:companies')
  async pledgeCompany(@MessageBody() pledgeDto: PledgeDto) {
    const { companies, name } = await this.fieldService.onPledgeCompany(pledgeDto, true)
    this.server.emit(`updateCompanies:${pledgeDto.room}`, companies)
    return { name }
  }
  @SubscribeMessage('redemption:streets')
  async redemptionStreets(@MessageBody() redemptionDto: RedemptionDto) {
    const { streets, name } = await this.fieldService.redemptionStreet(redemptionDto)
    this.server.emit(`updateStreets:${redemptionDto.room}`, streets)
    return name
  }

  @SubscribeMessage('redemption:railroads')
  async redemptionRailroad(@MessageBody() redemptionDto: RedemptionDto) {
    const { railroads, name } = await this.fieldService.onPledgeRailroad(redemptionDto, false)
    this.server.emit(`updateRailroads:${redemptionDto.room}`, railroads)
    return name
  }

  @SubscribeMessage('redemption:companies')
  async redemptionCompany(@MessageBody() redemptionDto: RedemptionDto) {
    const { companies, name } = await this.fieldService.onPledgeCompany(redemptionDto, false)
    this.server.emit(`updateCompanies:${redemptionDto.room}`, companies)
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
