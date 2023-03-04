import { Injectable } from '@nestjs/common';
import { KtPlace } from '@lib/entity/kt-place/kt-place.entity';
import { SktPlace } from '@lib/entity/skt-place/skt-place.entity';
import { PlaceType } from '../app/app.constant';
import { KtPlaceService } from '../kt-place/kt-place.service';
import { SktPlaceService } from '../skt-place/skt-place.service';
import { PlaceEntity } from './entity/place.entity';
import { PlaceListFilterQueryDto } from './place.dto';

@Injectable()
export class PlaceService {
  constructor(private readonly ktPlaceService: KtPlaceService, private readonly sktPlaceService: SktPlaceService) {}

  getRefinedPlaces(ktPlaces: KtPlace[], sktPlaces: SktPlace[], sortType = false) {
    const places: PlaceEntity[] = [];
    const ktLength = ktPlaces.length;
    const sktLength = sktPlaces.length;

    let ktIdx = 0,
      sktIdx = 0;

    while (ktIdx < ktLength && sktIdx < sktLength) {
      while (
        ktIdx < ktLength &&
        sktIdx < sktLength &&
        PlaceEntity.getPopulationLevel(ktPlaces[ktIdx].population.level) <=
          PlaceEntity.getPopulationLevel(undefined, sktPlaces[sktIdx].population.level)
      ) {
        if (sortType) {
          places.push(new PlaceEntity(sktPlaces[sktIdx++]));
        } else {
          places.push(new PlaceEntity(ktPlaces[ktIdx++]));
        }
      }

      while (
        ktIdx < ktLength &&
        sktIdx < sktLength &&
        PlaceEntity.getPopulationLevel(ktPlaces[ktIdx].population.level) >
          PlaceEntity.getPopulationLevel(undefined, sktPlaces[sktIdx].population.level)
      ) {
        if (sortType) {
          places.push(new PlaceEntity(ktPlaces[ktIdx++]));
        } else {
          places.push(new PlaceEntity(sktPlaces[sktIdx++]));
        }
      }
    }

    while (ktIdx < ktLength) places.push(new PlaceEntity(ktPlaces[ktIdx++]));
    while (sktIdx < sktLength) places.push(new PlaceEntity(sktPlaces[sktIdx++]));

    return places;
  }

  async getAllTypePlaces(query: PlaceListFilterQueryDto): Promise<PlaceEntity[]> {
    const [ktPlaces] = await this.ktPlaceService.getKtPlaces(query);
    const [sktPlaces] = await this.sktPlaceService.getSktPlaces(query);
    const places = this.getRefinedPlaces(ktPlaces, sktPlaces, query.populationSort);
    return places;
  }

  async getPlaceAllInfo(idx: number, type: PlaceType) {
    if (type === PlaceType.Kt) {
      return await this.ktPlaceService.getKtPlaceAllInfo(idx);
    } else if (type === PlaceType.Skt) {
      return await this.sktPlaceService.getSktPlaceAllInfo(idx);
    }
  }
}
