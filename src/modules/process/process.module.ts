import { Module } from '@nestjs/common';
import { ProcessController } from './process.controller';

@Module({
  controllers: [ProcessController],
  providers: [],
})
export class ProcessModule {}
