import { checkSimilarStreets } from '@common/utils'
import { FirebaseService, type Database } from '@firebase/firebase.service'
import { Injectable } from '@nestjs/common'
import type { Company, Railroad, Rents, Street, Streets } from '@types'
import { BuyDto, BuyPropertyDto, UpdateBoardCompanies, UpdateBoardRailroad, UpdateBoardStreet } from './dto'

@Injectable()
export class FieldService {
  private database: Database
  constructor(private readonly firebaseService: FirebaseService) {
    this.database = this.firebaseService.database
  }

  private async getDB<T>(path: string): Promise<T> {
    const result: T = (await this.database.ref(path).get()).val()
    return result
  }

  async updateStreet(updateBoardStreet: UpdateBoardStreet) {
    const { room, path, street } = updateBoardStreet
    await this.database.ref(`rooms/${room}/${path}`).update(street)
  }
  async updateRailroad(updateBoardRailroad: UpdateBoardRailroad) {
    const { room, path, railroad } = updateBoardRailroad
    await this.database.ref(`rooms/${room}/${path}`).update(railroad)
  }
  async updateCompanies(updateBoardCompanies: UpdateBoardCompanies) {
    const { room, path, companies } = updateBoardCompanies
    await this.database.ref(`rooms/${room}/${path}`).update(companies)
  }

  async buyStreets(buyDto: BuyDto, userId: number) {
    const { room, path } = buyDto

    const street: Street = await this.getDB(`rooms/${room}/${path}`)
    street.owner = userId
    street.rent['1empty'].bought = true

    await this.updateStreet({ path, room, street })

    await this.reloadBoughtColor(room, path)
    const updatedStreets: Streets = await this.getDB(`rooms/${room}/streets`)

    return { streets: updatedStreets, name: street.name }
  }

  private async reloadBoughtColor(room: number, path: string) {
    const color = path.split('/')[1]
    const streets: Street[] = await this.getDB(`rooms/${room}/streets/${color}`)

    const isSimilar = checkSimilarStreets(streets)

    streets.forEach(async (street) => {
      street.rent['2color'].bought = isSimilar
      await this.updateStreet({ room, path: `streets/${street.path}`, street })
    })
  }

  async buyRailroad(buyDto: BuyDto, userId: number) {
    const { room, path } = buyDto
    await this.updateRailroad({ path, room, railroad: { owner: userId } })
    const name = await this.getDB<string>(`rooms/${room}/${path}/name`)
    const updatedRailroads = await this.getDB<Railroad[]>(`rooms/${room}/railroads`)
    return { railroads: updatedRailroads, name }
  }
  async buyCompany(buyDto: BuyDto, userId: number) {
    const { room, path } = buyDto
    await this.updateCompanies({ path, room, companies: { owner: userId } })
    const name = await this.getDB<string>(`rooms/${room}/${path}/name`)
    const updatedCompanies = await this.getDB<Company[]>(`rooms/${room}/companies`)
    return { companies: updatedCompanies, name }
  }

  async changeProperty(buyPropertyDto: BuyPropertyDto) {
    const { room, path, isBuy } = buyPropertyDto

    await this.database.ref(`rooms/${room}/streets/${path}/bought`).set(isBuy)

    const name = await this.getDB<string>(`rooms/${room}/streets/${path.split('/rent')[0]}/name`)

    const updatedStreets = await this.getDB<Streets>(`rooms/${room}/streets`)

    return { streets: updatedStreets, name }
  }

  async foldOtherRent(room: number, rent: Rents, path: string, isBankrupt = false) {
    for (const [key, { bought }] of Object.entries(rent as Rents)) {
      if (isBankrupt) await this.database.ref(`rooms/${room}/streets/${path}/rent/1empty/bought`).set(false)
      if (key === '1empty') continue
      if (bought) await this.database.ref(`rooms/${room}/streets/${path}/rent/${key}/bought`).set(false)
    }
  }
}
