import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { ServiceAccount } from 'firebase-admin'
import * as admin from 'firebase-admin'
import type { Database as DB } from 'firebase-admin/lib/database/database'

@Injectable()
export class FirebaseService {
  constructor(private readonly configService: ConfigService) {}

  create_app() {
    const adminConfig: ServiceAccount = {
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    }
    // Initialize the firebase admin app
    return admin.initializeApp({
      credential: admin.credential.cert(adminConfig),
      databaseURL: this.configService.get<string>('FIREBASE_DATABASE_URL'),
    })
  }
  create_database(): Database {
    return admin.database(this.app)
  }

  app = this.create_app()
  database = this.create_database()
}
export interface Database extends DB {}
