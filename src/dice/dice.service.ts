import { FirebaseService } from '@firebase/firebase.service'
import { Injectable } from '@nestjs/common'
import { Database } from 'firebase-admin/lib/database/database'

@Injectable()
export class DiceService {
  private database: Database
  constructor(private readonly firebaseService: FirebaseService) {
    this.database = this.firebaseService.database
  }

  private async getDB<T>(path: string): Promise<T> {
    const result: T = (await this.database.ref(path).get()).val()
    return result
  }

  async addDice(id: number, userId: number) {
    const { dice, room } = await this.getDices(userId)

    if (!dice) {
      await this.database.ref(`rooms/${room}/dice/0`).set(userId)
      return { room, users: [userId] }
    }
    await this.database.ref(`rooms/${room}/dice/${dice.length}`).set(userId)
    return { room, users: [...dice, userId] }
  }

  async removeDice(userId: number) {
    const { dice, room } = await this.getDices(userId)

    if (!dice) return { room, users: [] }

    const users = dice.filter((id) => id !== userId)
    await this.database.ref(`rooms/${room}/dice`).set({ ...users })
    return { room, users }
  }

  async reloadDice(userId: number) {
    let { dice, room } = await this.getDices(userId)

    if (!dice) return { room, users: [] }

    dice = this.moveFirstElementToLast(dice)
    await this.database.ref(`rooms/${room}/dice`).update({ ...dice })
    return { room, users: dice }
  }

  private async getDices(userId: number) {
    const room: number = await this.getDB(`users/${userId}/room`)
    const dice: number[] | null = await this.getDB(`rooms/${room}/dice`)
    return { room, dice }
  }

  private moveLastElementToFirst(array: number[]): number[] {
    const lastElement = array.pop()
    array.unshift(lastElement!)
    return array
  }
  private moveFirstElementToLast(array: number[]): number[] {
    const firstElement = array.shift()
    array.push(firstElement!)
    return array
  }
}
