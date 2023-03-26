import { Validate } from 'class-validator';
import { IsNumber } from '../app/validations/common.validation';

export class PinReplyBodyDto {
  @Validate(IsNumber)
  replyIdx: number;
}

export class DeletePinReplyBodyDto extends PinReplyBodyDto {}
