import { Injectable } from '@nestjs/common'

import { DiceService } from '@dice/dice.service'
import { FieldService } from '@field/field.service'
import { FirebaseService, type Database } from '@firebase/firebase.service'
import { GamerService } from '@gamer/gamer.service'
import { UserService } from '@user/user.service'

import { EDITION, type Fields, type Room, type User } from '@types'
import { BoardRoomDto, CreateBoardDto } from './dto'
import { OriginalEdition, OriginalEdition as OriginalEdition2 } from './entities/editions'

@Injectable()
export class BoardService {
  private database: Database
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly gamerService: GamerService,
    private readonly diceService: DiceService,
    private readonly userService: UserService,
    private readonly fieldService: FieldService,
  ) {
    this.database = this.firebaseService.database
  }

  private async getDB<T>(path: string): Promise<T> {
    const result: T = (await this.database.ref(path).get()).val()
    return result
  }

  async checkRoom(room: number) {
    const id: number = await this.getDB(`rooms/${room}/id`)
    return !!id
  }

  async loadRoom(room: number, userId: number) {
    const isRoom = await this.checkRoom(room)
    if (!isRoom) return ''
    await this.gamerService.createGamer({ room, userId })
    await this.userService.update({ id: userId, room })
    return await this.initRoom(userId, false)
  }

  async resetBoard(boardRoomDto: BoardRoomDto, userId: number) {
    const { room } = boardRoomDto

    const board: Room = await this.getDB(`rooms/${room}`)
    const fields = this.createFields(board.edition)

    await this.database
      .ref(`rooms/${room}`)
      .set({ id: board.id, title: board.title, edition: board.edition, admin: board.admin, ...fields })
    Object.keys(board.gamers).forEach(async (userId) => {
      await this.gamerService.createGamer({ room, userId: +userId })
    })

    return await this.initRoom(userId)
  }

  async deleteRoom(room: number) {
    const board: Room = await this.getDB(`rooms/${room}`)
    await this.database.ref(`rooms/${room}`).remove()
    Object.keys(board.gamers).forEach(async (userId) => {
      await this.userService.update({ id: +userId, room: 0 })
    })
  }

  async createRoom(createBoardDto: CreateBoardDto, userId: number) {
    const id = Math.floor(+new Date() * Math.random())
    const { edition, title } = createBoardDto

    const fields = this.createFields(edition)

    const board = {
      id,
      title,
      edition,
      admin: userId,
      ...fields,
    }

    await this.database.ref(`rooms/${id}`).set(board)
    await this.userService.update({ id: userId, room: id })
    const gamers = await this.gamerService.createGamer({ room: id, userId: userId })

    return JSON.stringify({ board, gamers: [gamers] })
  }

  private createFields(edition: EDITION) {
    let _edition: Fields
    if (edition === EDITION.ORIGINAL) _edition = OriginalEdition
    else _edition = OriginalEdition2
    return { ..._edition }
  }

  async initRoom(id: number, asString = true) {
    const user: User = await this.getDB(`users/${id}`)
    if (!user.room) return
    const board: Room = await this.getDB(`rooms/${user.room}`)

    const gamers = Object.values(board.gamers)

    const dice = board.dice ?? []
    const confirmation = board.confirmation ? Object.values(board.confirmation) : undefined
    delete board.gamers
    delete board.dice
    delete board.confirmation

    return asString ? JSON.stringify({ board, gamers, dice, confirmation }) : { board, gamers, dice, confirmation }
  }
  async initRoomByRoom(room: number, asString = true) {
    const board: Room = await this.getDB(`rooms/${room}`)

    const gamers = Object.values(board.gamers)

    const dice = board.dice ?? []
    const confirmation = board.confirmation ? Object.values(board.confirmation) : undefined
    delete board.gamers
    delete board.dice
    delete board.confirmation

    return asString ? JSON.stringify({ board, gamers, dice, confirmation }) : { board, gamers, dice, confirmation }
  }
}
