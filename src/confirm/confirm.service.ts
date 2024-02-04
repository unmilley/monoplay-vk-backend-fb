import { BoardService } from '@board/board.service'
import { FirebaseService, type Database } from '@firebase/firebase.service'
import { GamerService } from '@gamer/gamer.service'
import { Injectable } from '@nestjs/common'
// import { Confirm } from '@types';
// import { AcceptConfirmDto, CancelConfirmDto, CreateConfirmDto } from './dto';

@Injectable()
export class ConfirmService {
  private database: Database
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly boardService: BoardService,
    private readonly gamerService: GamerService,
  ) {
    this.database = this.firebaseService.database
  }

  // async create(createConfirmDto: CreateConfirmDto, userId: number) {
  //   const { room } = await this.prismaService.user.findUnique({ where: { id: userId }, select: { room: true } });

  //   const { orderBy, orderFor } = createConfirmDto;
  //   const gamerId = orderFor.userId;

  //   const confirm = await this.prismaService.confirmation.create({
  //     data: {
  //       boardId: room,
  //       orderBy: orderBy as unknown as Prisma.InputJsonValue,
  //       orderFor: orderFor as unknown as Prisma.InputJsonValue,
  //     },
  //   });

  //   return { confirm: [confirm], gamerId };
  // }

  // async accept(acceptConfirmDto: AcceptConfirmDto) {
  //   const { boardId, id } = acceptConfirmDto;
  //   const confirm = await this.prismaService.confirmation.delete({ where: { boardId, id } });

  //   const orderBy = confirm.orderBy as unknown as Confirm;
  //   const orderFor = confirm.orderFor as unknown as Confirm;

  //   if ('paths' in orderBy) {
  //     // orderBy.paths.forEach(async (path) => {
  //     for await (const path of orderBy.paths) {
  //       const id = path.split('/')[0];
  //       if (id === 'streets') await this.boardService.buyStreets({ room: boardId, path }, orderFor.userId);
  //       else if (id === 'railroads') await this.boardService.buyRailroad({ room: boardId, path }, orderFor.userId);
  //       else if (id === 'companies') await this.boardService.buyCompany({ room: boardId, path }, orderFor.userId);
  //     }
  //     // });
  //   }
  //   if ('paths' in orderFor) {
  //     // orderFor.paths.forEach(async (path) => {
  //     for await (const path of orderFor.paths) {
  //       const id = path.split('/')[0];
  //       if (id === 'streets') await this.boardService.buyStreets({ room: boardId, path }, orderBy.userId);
  //       else if (id === 'railroads') await this.boardService.buyRailroad({ room: boardId, path }, orderBy.userId);
  //       else if (id === 'companies') await this.boardService.buyCompany({ room: boardId, path }, orderBy.userId);
  //     }
  //     // });
  //   }

  //   if ('giving' in orderFor) {
  //     await this.gamerService.updateMoneyConfirm(boardId, orderBy.userId, +orderFor.giving);
  //     await this.gamerService.updateMoneyConfirm(boardId, orderFor.userId, +orderFor.giving * -1);
  //   }
  //   if ('giving' in orderBy) {
  //     await this.gamerService.updateMoneyConfirm(boardId, orderFor.userId, +orderBy.giving);
  //     await this.gamerService.updateMoneyConfirm(boardId, orderBy.userId, +orderBy.giving * -1);
  //   }
  //   const room = await this.boardService.initRoom(orderBy.userId);
  //   return room;
  // }

  // cancel(cancelConfirmDto: CancelConfirmDto) {
  //   const { boardId, id } = cancelConfirmDto;
  //   this.prismaService.confirmation.delete({ where: { boardId, id } }).catch((err) => err);
  // }
}
