import { DiceService } from '@dice/dice.service'
import { FieldService } from '@field/field.service'
import { FirebaseService, type Database } from '@firebase/firebase.service'
import { Injectable } from '@nestjs/common'
import { Company, Railroad, Streets } from '@types'
import { UserService } from '@user/user.service'
import { CreateGamerDto, UpdateGamerBankrupt, UpdateGamerDto, UpdateGamerMoney } from './dto'

@Injectable()
export class GamerService {
  private database: Database
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
    private readonly diceService: DiceService,
    private readonly fieldService: FieldService,
  ) {
    this.database = this.firebaseService.database
  }

  private async getDB<T>(path: string): Promise<T> {
    const result: T = (await this.database.ref(path).get()).val()
    return result
  }

  async updateGamer(updateBoardStreet: UpdateGamerDto) {
    const { room, userId, gamer } = updateBoardStreet
    await this.database.ref(`rooms/${room}/gamers/${userId}`).update(gamer)
  }

  async createGamer(createGamerDto: CreateGamerDto) {
    const { userId, room } = createGamerDto

    const user = await this.userService.get(userId)
    if (!user) return null

    const newGamer = {
      boardId: room,
      id: user.id,
      name: user.firstName,
      money: 1500,
      isBankrupt: false,
    }

    await this.database.ref(`rooms/${room}/gamers/${userId}`).set(newGamer)
    return newGamer
  }

  async updateMoney(updateGamerMoney: UpdateGamerMoney) {
    const { room, userId, money } = updateGamerMoney
    await this.updateGamer({ room, userId, gamer: { money } })
    const gamers = await this.getDB(`rooms/${room}/gamers`)
    return { room, gamers: Object.values(gamers) }
  }

  async updateMoneyConfirm(room: number, userId: number, sum: number) {
    const money: number = await this.getDB(`rooms/${room}/gamers/${userId}/money`)
    await this.updateGamer({ room, userId, gamer: { money: money + sum } })
  }

  async updateBankrupt(updateGamerBankrupt: UpdateGamerBankrupt, userId: number) {
    const { room, leave } = updateGamerBankrupt

    await this.diceService.removeDice(userId)

    if (leave) await this.removeGamer(room, userId)
    else await this.updateGamer({ room, userId, gamer: { isBankrupt: true } })
  }

  /* ~~~~~~~~~~~~~~~~ */

  async removeGamer(room: number, userId: number) {
    const { streets, railroads, companies } = await this.getGoodsById(room, userId)

    await this.database.ref(`rooms/${room}/gamers/${userId}`).remove()
    await this.userService.update({ id: userId, room: 0 })

    streets.forEach(async ({ path, rent }) => {
      await this.fieldService.updateStreet({ room, path: `streets/${path}`, street: { owner: 0, isPledged: false } })
      await this.fieldService.foldOtherRent(room, rent, path, true)
    })
    railroads.forEach(async (path) => {
      await this.fieldService.updateRailroad({ room, path, railroad: { owner: 0, isPledged: false } })
    })
    companies.forEach(async (path) => {
      await this.fieldService.updateCompanies({ room, path, companies: { owner: 0, isPledged: false } })
    })
  }

  async getGoodsById(room: number, id: number) {
    const streets: Streets = await this.getDB(`rooms/${room}/streets`)
    const railroads: Railroad[] = await this.getDB(`rooms/${room}/railroads`)
    const companies: Company[] = await this.getDB(`rooms/${room}/companies`)
    return {
      streets: Object.values(streets).flatMap((color) => color.filter(({ owner }) => owner === id)),
      railroads: Object.values(railroads)
        .map(({ owner, path }) => (owner === id ? `railroads/${path}` : null))
        .filter((val) => !!val),
      companies: Object.values(companies)
        .map(({ owner, path }) => (owner === id ? `companies/${path}` : null))
        .filter((val) => !!val),
    }
  }
}
