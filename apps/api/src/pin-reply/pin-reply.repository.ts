import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { PinReply } from '@lib/entity/pin-reply/pin-reply.entity';
import { UserEntity } from '../user/entity/user.entity';
import { Reply } from '@lib/entity/reply/reply.entity';

@Injectable()
export class PinReplyRepository {
  constructor(@InjectRepository(PinReply) private repository: Repository<PinReply>) {}

  createInstance(user: UserEntity, reply: Reply) {
    return this.repository.create({ user, reply });
  }

  async addPinReply(pinReply: PinReply, manager?: EntityManager) {
    if (manager) {
      return manager.save(PinReply, pinReply);
    }
    return this.repository.save(pinReply);
  }

  async getPinReply(where: FindOptionsWhere<PinReply>, relations?: string[]): Promise<PinReply | undefined> {
    const options: any = { where };
    if (Array.isArray(relations)) {
      options.relations = relations;
    }
    const pinReply = await this.repository.findOne(options);
    return pinReply || undefined;
  }

  async deletePinReply(pinReply: PinReply, manager?: EntityManager) {
    if (manager) {
      return manager.remove(PinReply, pinReply);
    }
    return this.repository.remove(pinReply);
  }
}
