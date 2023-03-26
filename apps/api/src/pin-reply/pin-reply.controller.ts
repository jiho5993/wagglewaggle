import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { IRequestAugmented } from '../app/app.interface';
import { UserGuard } from '../app/guards/user.guard';
import { ApiPath } from './pin-reply.constant';
import { DeletePinReplyBodyDto, PinReplyBodyDto } from './pin-reply.dto';
import { PinReplyService } from './pin-reply.service';

@Controller(ApiPath.Root)
@UseGuards(UserGuard)
export class PinReplyController {
  constructor(private readonly pinReplyService: PinReplyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addPinReply(@Req() req: IRequestAugmented, @Body() body: PinReplyBodyDto) {
    const user = req.extras.getUser();
    await this.pinReplyService.addPinReply(user, body.replyIdx);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deletePinReply(@Req() req: IRequestAugmented, @Body() body: DeletePinReplyBodyDto) {
    const user = req.extras.getUser();
    await this.pinReplyService.deletePinReply(user, body.replyIdx);
  }
}
