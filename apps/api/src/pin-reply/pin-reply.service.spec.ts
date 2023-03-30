import { Test, TestingModule } from '@nestjs/testing';
import { PinReplyService } from './pin-reply.service';

describe('PinReplyService', () => {
  let service: PinReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PinReplyService],
    }).compile();

    service = module.get<PinReplyService>(PinReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
