import { HttpStatus, Injectable } from '@nestjs/common';
import { KtPlace } from '@lib/entity/kt-place/kt-place.entity';
import { SktPlace } from '@lib/entity/skt-place/skt-place.entity';
import { PlaceType } from '../app/app.constant';
import ERROR_CODE from '../app/exceptions/error-code';
import { ClientRequestException } from '../app/exceptions/request.exception';
import { KtPlaceService } from '../kt-place/kt-place.service';
import { SktPlaceService } from '../skt-place/skt-place.service';
import { PlaceEntity } from './entity/place.entity';
import { PlaceListFilterQueryDto } from './place.dto';

@Injectable()
export class PlaceService {
  constructor(private readonly ktPlaceService: KtPlaceService, private readonly sktPlaceService: SktPlaceService) {}

  async getAllTypePlaces(query: PlaceListFilterQueryDto): Promise<PlaceEntity[]> {
    const [ktPlaces] = await this.ktPlaceService.getKtPlaces(query);
    const [sktPlaces] = await this.sktPlaceService.getSktPlaces(query);
    return PlaceEntity.getRefinedPlaces(ktPlaces, sktPlaces, query.populationSort);
  }

  async getPlaceAllInfo(idx: number, type: PlaceType): Promise<PlaceEntity> {
    switch (type) {
      case PlaceType.Kt:
        return new PlaceEntity(await this.ktPlaceService.getKtPlaceAllInfo(idx));
      case PlaceType.Skt:
        return new PlaceEntity(await this.sktPlaceService.getSktPlaceAllInfo(idx));
      default:
        throw new ClientRequestException(ERROR_CODE.ERR_0000001, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getRefinedPlaceObject(idx: number, type: PlaceType) {
    const place = await this.getPlaceAllInfo(idx, type);
    if (!place) {
      throw new ClientRequestException(ERROR_CODE.ERR_0002001, HttpStatus.BAD_REQUEST);
    }

    return {
      sktPlace: type === PlaceType.Skt ? (place.getInstancePlaceType() as SktPlace) : undefined,
      ktPlace: type === PlaceType.Kt ? (place.getInstancePlaceType() as KtPlace) : undefined,
      extraPlace: type === PlaceType.Extra ? undefined : undefined, // TODO: implement extra place
    };
  }
}
