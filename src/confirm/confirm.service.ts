import { BoardService } from '@board/board.service'
import { FirebaseService, type Database } from '@firebase/firebase.service'
import { GamerService } from '@gamer/gamer.service'
import { Injectable } from '@nestjs/common'
import type { ConfirmState } from '@types'
import type { AcceptConfirmDto, CancelConfirmDto, CreateConfirmDto } from './dto'
// import { Confirm } from '@types';
// import { AcceptConfirmDto, CancelConfirmDto, CreateConfirmDto } from './dto';
import { FieldService } from '../field/field.service'

@Injectable()
export class ConfirmService {
  private database: Database
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly fieldService: FieldService,
    private readonly boardService: BoardService,
    private readonly gamerService: GamerService,
  ) {
    this.database = this.firebaseService.database
  }
  private async getDB<T>(path: string): Promise<T> {
    const result: T = (await this.database.ref(path).get()).val()
    return result
  }

  /* 
  export interface ConfirmState {
  orderBy: Confirm;
  orderFor: Confirm;
  checked: boolean;
  id: number;
  boardId: number;
}

export interface Confirm {
  userId: number;
  name: string;
  giving?: string;
  names: string[];
  paths: string[];
}
  */

  async create(createConfirmDto: CreateConfirmDto) {
    const { orderBy, orderFor, room } = createConfirmDto
    const id = Math.floor(+new Date() * Math.random())

    const gamerId = orderFor.userId

    const confirm: ConfirmState = {
      boardId: room,
      checked: false,
      id,
      orderBy,
      orderFor,
    }
    await this.database.ref(`rooms/${room}/confirmation/${id}`).set(confirm)

    return { confirm: [confirm], gamerId }
  }

  async accept(acceptConfirmDto: AcceptConfirmDto) {
    const { room, id } = acceptConfirmDto
    const confirm = await this.getDB<ConfirmState>(`rooms/${room}/confirmation/${id}`)
    await this.database.ref(`rooms/${room}/confirmation/${id}`).remove()
    const orderBy = confirm.orderBy
    const orderFor = confirm.orderFor

    if ('paths' in orderBy) {
      for await (const path of orderBy.paths) {
        const id = path.split('/')[0]
        if (id === 'streets') await this.fieldService.buyStreets({ room, path }, orderFor.userId)
        else if (id === 'railroads') await this.fieldService.buyRailroad({ room, path }, orderFor.userId)
        else if (id === 'companies') await this.fieldService.buyCompany({ room, path }, orderFor.userId)
      }
    }
    if ('paths' in orderFor) {
      // orderFor.paths.forEach(async (path) => {
      for await (const path of orderFor.paths) {
        const id = path.split('/')[0]
        if (id === 'streets') await this.fieldService.buyStreets({ room, path }, orderBy.userId)
        else if (id === 'railroads') await this.fieldService.buyRailroad({ room, path }, orderBy.userId)
        else if (id === 'companies') await this.fieldService.buyCompany({ room, path }, orderBy.userId)
      }
      // });
    }

    if ('giving' in orderFor) {
      await this.gamerService.updateMoneyConfirm(room, orderBy.userId, +orderFor.giving)
      await this.gamerService.updateMoneyConfirm(room, orderFor.userId, +orderFor.giving * -1)
    }
    if ('giving' in orderBy) {
      await this.gamerService.updateMoneyConfirm(room, orderFor.userId, +orderBy.giving)
      await this.gamerService.updateMoneyConfirm(room, orderBy.userId, +orderBy.giving * -1)
    }
    const _room = await this.boardService.initRoomByRoom(room)
    return _room
  }

  async cancel(cancelConfirmDto: CancelConfirmDto) {
    const { room, id } = cancelConfirmDto
    await this.database.ref(`rooms/${room}/confirmation/${id}`).remove()
  }
}
