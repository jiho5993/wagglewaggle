import { Module } from '@nestjs/common';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { GoogleService } from './services/google.service';
import { KakaoService } from './services/kakao.service';
import { NaverService } from './services/naver.service';

@Module({
  imports: [UserModule, UserRoleModule],
  providers: [NaverService, KakaoService, GoogleService],
  controllers: [AuthController],
})
export class AuthModule {}
