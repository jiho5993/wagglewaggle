import { HttpStatus, Injectable } from '@nestjs/common';
import { KtPlace } from '@lib/entity/kt-place/kt-place.entity';
import ERROR_CODE from '../app/exceptions/error-code';
import { ClientRequestException } from '../app/exceptions/request.exception';
import { KtPlaceRepository } from './kt-place.repository';
import { KtPlaceListFilterQueryDto } from './kt-place.dto';
import { LocationService } from '../location/location.service';
import { Location } from '@lib/entity/location/location.entity';
import { PlaceListFilterQueryDto } from '../place/place.dto';

@Injectable()
export class KtPlaceService {
  constructor(private readonly ktPlaceRepository: KtPlaceRepository, private readonly locationService: LocationService) {}

  async getKtPlaces(query: PlaceListFilterQueryDto): Promise<[KtPlace[], number]> {
    return await this.ktPlaceRepository.getKtPlaces(query);
  }

  async getKtPlaceByIdx(idx: number, relation?: string[]): Promise<KtPlace> {
    const [place] = await this.ktPlaceRepository.getKtPlace({ idx }, relation);
    if (!place) {
      throw new ClientRequestException(ERROR_CODE.ERR_0002001, HttpStatus.BAD_REQUEST);
    }

    return place;
  }

  async getKtPlaceAllInfo(idx: number): Promise<KtPlace | [KtPlace, Location]> {
    const place = await this.getKtPlaceByIdx(idx, ['population', 'accidents', 'cctvs', 'ktRoadTraffic', 'location']);
    if (!place.location) {
      return place;
    }
    const location = await this.locationService.getLocationByName(place.location.name);
    return [place, location];
  }
}
