import { FirebaseService, type Database } from '@firebase/firebase.service'
import { Injectable } from '@nestjs/common'
import { User } from '@types'
import type { InitUserDto, UpdateUserDto, UpdateUserEarnDto, UpdateUserLossDto } from './dto'

@Injectable()
export class UserService {
  private database: Database
  constructor(private readonly firebaseService: FirebaseService) {
    this.database = this.firebaseService.database
  }
  private async getDB<T>(path: string): Promise<T> {
    const result: T = (await this.database.ref(path).get()).val()
    return result
  }

  async create(initUserDto: InitUserDto): Promise<User> {
    const { id, lastName, firstName } = initUserDto
    const data: User = {
      id: +id,
      firstName,
      lastName,
      earnings: 0,
      loss: 0,
      room: 0,
      createAt: new Date().toISOString(),
      useRofls: false,
      keys: 3,
    }
    await this.database.ref(`users/${id}`).set(data)
    return data
  }

  async get(id: number): Promise<User | null> {
    const user = (await this.database.ref(`users/${id}`).get()).val()
    return user
  }

  async init(initUserDto: InitUserDto) {
    const user = await this.get(initUserDto.id)
    if (user) return user
    const newUser = await this.create(initUserDto)
    return newUser
  }
  async update(updateUserDto: UpdateUserDto) {
    const { id } = updateUserDto
    await this.database.ref(`users/${id}`).update(updateUserDto)

    const user = await this.get(id)
    if (user) return user
  }

  async loss(lossDto: UpdateUserLossDto) {
    const { id, loss } = lossDto
    if (!id) return
    const money = await this.getDB<number>(`users/${id}/loss`)
    await this.database.ref(`users/${id}`).update({ loss: money + loss })
  }
  async earn(earnDto: UpdateUserEarnDto) {
    const { id, earnings } = earnDto
    if (!id) return
    const money = await this.getDB<number>(`users/${id}/earnings`)
    await this.database.ref(`users/${id}`).update({ earnings: money + earnings })
  }
}
