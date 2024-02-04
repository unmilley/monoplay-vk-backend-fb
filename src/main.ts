import { NestFactory } from '@nestjs/core'

import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface'
import * as fs from 'fs'
import { AppModule } from './app.module'

import { ConfigService } from '@nestjs/config'

const httpsOptions: HttpsOptions = {
  key: fs.readFileSync('./.https/localhost-key.pem'),
  cert: fs.readFileSync('./.https/localhost.pem'),
}

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, process.env.NODE_ENV === 'development' ? { httpsOptions } : {})

  const configService: ConfigService = app.get(ConfigService)
  // Set the config options

  app.enableCors({ origin: '*', credentials: true })

  app.useGlobalInterceptors()

  await app.listen(configService.get<string>('API_PORT') ?? 3500)
  console.log(`Application is running on: ${await app.getUrl()}/`)
}

bootstrap()
