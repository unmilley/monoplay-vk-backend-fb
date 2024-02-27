import { Body, Controller, Patch, Post } from '@nestjs/common'
import type { InitUserDto, UpdateUserDto, UpdateUserEarnDto, UpdateUserLossDto } from './dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('init')
  init(@Body() initUserDto: InitUserDto) {
    return this.userService.init(initUserDto)
  }

  @Patch('update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto)
  }

  @Patch('update/money/lose')
  loss(@Body() lossDto: UpdateUserLossDto) {
    this.userService.loss(lossDto)
  }

  @Patch('update/money/earn')
  earn(@Body() earnDto: UpdateUserEarnDto) {
    this.userService.earn(earnDto)
  }
}
