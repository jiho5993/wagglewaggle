import { Test, TestingModule } from '@nestjs/testing';
import { PinReplyController } from './pin-reply.controller';

describe('PinReplyController', () => {
  let controller: PinReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PinReplyController],
    }).compile();

    controller = module.get<PinReplyController>(PinReplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
