import { Module } from '@nestjs/common'
import { APIService } from './API.service'

@Module({
  providers: [APIService],
  exports: [APIService],
})
export class APIModule {}
