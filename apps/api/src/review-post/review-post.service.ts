import { HttpStatus, Injectable } from '@nestjs/common';
import { ReviewPostStatus } from '@lib/entity/review-post/review-post.constant';
import { PlaceType } from '../app/app.constant';
import { PlaceService } from '../place/place.service';
import { UserEntity } from '../user/entity/user.entity';
import { ReviewPostRepository } from './review-post.repository';
import { ListFilterQueryDto } from '../app/app.dto';
import { ClientRequestException } from '../app/exceptions/request.exception';
import ERROR_CODE from '../app/exceptions/error-code';
import { ReviewPostEntity } from './entity/review-post.entity';

@Injectable()
export class ReviewPostService {
  constructor(private readonly reviewPostRepository: ReviewPostRepository, private readonly placeService: PlaceService) {}

  async addReviewPost(user: UserEntity, placeIdx: number, placeType: PlaceType, content: string, imgUrl?: string) {
    const placeObject = await this.placeService.getRefinedPlaceObject(placeIdx, placeType);

    const reviewPost = this.reviewPostRepository.createInstance({
      content,
      view: 0,
      report: 0,
      status: ReviewPostStatus.Activated,
      user,
      ...placeObject,
    });
    await this.reviewPostRepository.addReviewPost(reviewPost);
  }

  async getReviewPostsByPlace(idx: number, placeType: PlaceType, query: ListFilterQueryDto): Promise<[ReviewPostEntity[], number]> {
    const place = await this.placeService.getPlaceAllInfo(idx, placeType);
    return await this.reviewPostRepository.getReviewPostsByPlace(placeType, place, query);
  }

  async getReviewPost(idx: number, placeType: PlaceType, reviewPostIdx: number): Promise<ReviewPostEntity> {
    const place = await this.placeService.getPlaceAllInfo(idx, placeType);
    if (!place) {
      throw new ClientRequestException(ERROR_CODE.ERR_0002001, HttpStatus.BAD_REQUEST);
    }

    const reviewPost = await this.reviewPostRepository.getReviewPost({ idx: reviewPostIdx }, [
      'replies',
      'replies.user',
      'reviewPostImages',
      'pinReviewPosts',
      'pinReviewPosts.user',
      'user',
      'sktPlace',
      'ktPlace',
      'extraPlace',
    ]);
    if (!reviewPost) {
      throw new ClientRequestException(ERROR_CODE.ERR_0008001, HttpStatus.BAD_REQUEST);
    }

    /**
     * TODO: place type과 reviewPost의 place가 다를 경우 예외 처리
     */

    return reviewPost;
  }
}