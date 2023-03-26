import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reply } from '../reply/reply.entity';
import { User } from '../user/user.entity';

@Entity()
export class PinReply {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne(() => User, (user) => user.pinReplies)
  user: User;

  @ManyToOne(() => Reply, (reply) => reply.pinReplies)
  reply: Reply;

  @CreateDateColumn()
  createdDate: Date;
}
