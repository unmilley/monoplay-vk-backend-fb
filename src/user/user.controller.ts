import { Body, Controller, Patch, Post } from '@nestjs/common'
import { InitUserDto, UpdateUserDto } from './dto'
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
}
