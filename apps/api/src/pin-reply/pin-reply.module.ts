import { Module } from '@nestjs/common';
import { PinReplyService } from './pin-reply.service';
import { PinReplyController } from './pin-reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinReply } from '@lib/entity/pin-reply/pin-reply.entity';
import { PinReplyRepository } from './pin-reply.repository';
import { ReplyModule } from '../reply/reply.module';

@Module({
  imports: [TypeOrmModule.forFeature([PinReply]), ReplyModule],
  providers: [PinReplyService, PinReplyRepository],
  controllers: [PinReplyController],
})
export class PinReplyModule {}
