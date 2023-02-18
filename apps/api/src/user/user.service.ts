import { Injectable } from '@nestjs/common';
import { DeepPartial, EntityManager } from 'typeorm';
import { SnsType } from '@lib/entity/user/user.constant';
import { UserRepository } from './user.repository';
import { User } from '@lib/entity/user/user.entity';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  createInstance(user: DeepPartial<User>) {
    return this.userRepository.createInstance(user);
  }

  async getUserById(idx: number): Promise<UserEntity | undefined> {
    const user = await this.userRepository.getUser({ idx });
    if (user) {
      return new UserEntity(user);
    }
    return undefined;
  }

  async getUserBySnsId(snsId: string, snsType: SnsType): Promise<UserEntity | undefined> {
    const user = await this.userRepository.getUser({ snsId, snsType });
    if (user) {
      return new UserEntity(user);
    }
    return undefined;
  }

  async addUser(user: UserEntity, manager?: EntityManager) {
    return await this.userRepository.addUser(user, manager);
  }
}
