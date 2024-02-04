import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { BoardModule } from '@board/board.module'
import { ConfirmModule } from '@confirm/confirm.module'
import { DiceModule } from '@dice/dice.module'
import { FieldModule } from '@field/field.module'
import { FirebaseModule } from '@firebase/firebase.module'
import { GamerModule } from '@gamer/gamer.module'
import { UserModule } from '@user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    BoardModule,
    UserModule,
    ConfirmModule,
    DiceModule,
    GamerModule,
    FieldModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
