import type { Database } from 'firebase-admin/lib/database/database'

import { Injectable } from '@nestjs/common'
import { User } from '@types'
import { FirebaseService } from 'src/firebase/firebase.service'
import { InitUserDto } from './dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  private database: Database
  constructor(private readonly firebaseService: FirebaseService) {
    this.database = this.firebaseService.database
  }
  async create(initUserDto: InitUserDto): Promise<User> {
    const { id, lastName, firstName } = initUserDto
    const data: User = {
      id: +id,
      firstName,
      lastName,
      room: 0,
      useRofls: false,
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
  }
}
