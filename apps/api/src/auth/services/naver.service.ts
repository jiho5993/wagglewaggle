import { HttpStatus, Injectable } from '@nestjs/common';
import { config } from '@lib/config';
import { IAuthCallbackResult } from '../auth.interface';
import { CallbackQueryDto } from '../auth.type';
import { ClientRequestException } from '../../app/exceptions/request.exception';
import ERROR_CODE from '../../app/exceptions/error-code';
import axios, { AxiosError } from 'axios';
import { NaverApiUrl } from '../auth.constant';
import { BaseAuthService } from '../base-auth.service';
import { UserService } from '../../user/user.service';
import { SnsType, UserStatus } from '@lib/entity/user/user.constant';
import { jwtSign } from '../../app/app.util';
import { UserRoleService } from '../../user-role/user-role.service';
import { DataSource } from 'typeorm';
import { INaverInformationResponse, INaverTokenResponse } from '../auth-platform.interface';

@Injectable()
export class NaverService extends BaseAuthService {
  constructor(readonly userService: UserService, readonly userRoleService: UserRoleService, readonly dataSource: DataSource) {
    super(userService, userRoleService);
  }

  async callback(query: CallbackQueryDto): Promise<IAuthCallbackResult> {
    const token = (await this.getToken(query.code)) as INaverTokenResponse;
    if (token.error) {
      throw new ClientRequestException(ERROR_CODE.ERR_0005001, HttpStatus.UNAUTHORIZED, { errorDesc: token.error_description });
    }

    const userNaverInformation = (await this.getInformation(token.access_token, token.token_type)) as INaverInformationResponse;

    const isDuplicatedUser = await this.checkDuplicatedUser(userNaverInformation.response.id, SnsType.Naver);
    if (!isDuplicatedUser) {
      await this.addNewUser(
        this.userService.createInstance({
          snsId: userNaverInformation.response.id,
          snsType: SnsType.Naver,
          email: userNaverInformation.response.email,
          name: userNaverInformation.response.name,
          nickname: userNaverInformation.response.nickname,
          status: UserStatus.Activated,
        }),
      );
    }

    const user = await this.userService.getUserBySnsId(userNaverInformation.response.id, SnsType.Naver);
    user.isActivated();

    const payload = { type: user.snsType, email: user.email, name: user.name };
    const jwtToken = await jwtSign(payload);

    return {
      token: jwtToken,
      payload,
      existUser: isDuplicatedUser,
    };
  }

  protected async getToken(code: string): Promise<Record<string, any>> {
    try {
      const query = {
        client_id: config.naverClientId,
        client_secret: config.naverClientSecret,
        code,
        state: 'test',
      };
      const { data } = await axios.post(this.generateRequestUrl(NaverApiUrl.Token, query));
      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new ClientRequestException(ERROR_CODE.ERR_0005001, HttpStatus.UNAUTHORIZED);
      }
      throw new ClientRequestException(ERROR_CODE.ERR_0000001, HttpStatus.INTERNAL_SERVER_ERROR, e);
    }
  }

  protected async getInformation(token: string, type: string): Promise<Record<string, any>> {
    try {
      const { data } = await axios.post(
        NaverApiUrl.Information,
        {},
        {
          headers: {
            Authorization: `${type} ${token}`,
          },
        },
      );
      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new ClientRequestException(ERROR_CODE.ERR_0005001, HttpStatus.UNAUTHORIZED);
      }
      throw new ClientRequestException(ERROR_CODE.ERR_0000001, HttpStatus.INTERNAL_SERVER_ERROR, e);
    }
  }
}
