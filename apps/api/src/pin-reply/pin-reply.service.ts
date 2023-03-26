import { HttpStatus, Injectable } from '@nestjs/common';
import { ReplyStatus } from '@lib/entity/reply/reply.constant';
import ERROR_CODE from '../app/exceptions/error-code';
import { ClientRequestException } from '../app/exceptions/request.exception';
import { ReplyService } from '../reply/reply.service';
import { UserEntity } from '../user/entity/user.entity';
import { PinReplyRepository } from './pin-reply.repository';

@Injectable()
export class PinReplyService {
  constructor(private readonly pinReplyRepository: PinReplyRepository, private readonly replyService: ReplyService) {}

  async addPinReply(user: UserEntity, replyIdx: number) {
    const reply = await this.replyService.getReplyByIdx(replyIdx);
    if (reply.status !== ReplyStatus.Activated) {
      throw new ClientRequestException(ERROR_CODE.ERR_0009002, HttpStatus.BAD_REQUEST);
    }

    const existPinReply = await this.pinReplyRepository.getPinReply({ user: { idx: user.idx }, reply: { idx: replyIdx } });
    if (existPinReply) {
      throw new ClientRequestException(ERROR_CODE.ERR_0010001, HttpStatus.BAD_REQUEST);
    }

    const pinReply = this.pinReplyRepository.createInstance(user, reply);
    await this.pinReplyRepository.addPinReply(pinReply);
  }

  async deletePinReply(user: UserEntity, replyIdx: number) {
    const pinReply = await this.pinReplyRepository.getPinReply({ user: { idx: user.idx }, reply: { idx: replyIdx } }, ['user']);
    if (!pinReply) {
      throw new ClientRequestException(ERROR_CODE.ERR_0010002, HttpStatus.BAD_REQUEST);
    }
    if (pinReply.user.idx !== user.idx) {
      throw new ClientRequestException(ERROR_CODE.ERR_0000005, HttpStatus.FORBIDDEN);
    }

    await this.pinReplyRepository.deletePinReply(pinReply);
  }
}
