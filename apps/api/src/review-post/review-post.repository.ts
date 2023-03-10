import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { ReviewPost } from '@lib/entity/review-post/review-post.entity';
import { ReviewPostEntity } from './entity/review-post.entity';
import { PlaceType } from '../app/app.constant';
import { ListFilterQueryDto } from '../app/app.dto';
import { PlaceEntity } from '../place/entity/place.entity';

@Injectable()
export class ReviewPostRepository {
  constructor(@InjectRepository(ReviewPost) private readonly repository: Repository<ReviewPost>) {}

  createInstance(reviewPost: DeepPartial<ReviewPost>): ReviewPost {
    return this.repository.create(reviewPost);
  }

  createQueryBuilder(alias = 'reviewPost') {
    return this.repository.createQueryBuilder(alias);
  }

  async addReviewPost(reviewPost: ReviewPost, manager?: EntityManager) {
    if (manager) {
      return manager.save(ReviewPost, reviewPost);
    }
    return this.repository.save(reviewPost);
  }

  async getReviewPost(where: FindOptionsWhere<ReviewPost>, relations?: string[]): Promise<ReviewPostEntity | undefined> {
    const options: any = { where };
    if (Array.isArray(relations)) {
      options.relations = relations;
    }
    const [reviewPost] = await this.repository.find(options);
    if (reviewPost) {
      return new ReviewPostEntity(reviewPost);
    }
  }

  async getReviewPostsByPlace(placeType: PlaceType, place: PlaceEntity, query: ListFilterQueryDto): Promise<[ReviewPostEntity[], number]> {
    const queryBuilder = this.createQueryBuilder()
      .leftJoinAndSelect('reviewPost.replies', 'reply')
      .leftJoinAndSelect('reviewPost.reviewPostImages', 'reviewPostImage')
      .leftJoinAndSelect('reviewPost.pinReviewPosts', 'pinReviewPost')
      .leftJoinAndSelect('reviewPost.user', 'user');

    if (placeType === PlaceType.Kt) {
      queryBuilder.leftJoinAndSelect('reviewPost.ktPlace', 'ktPlace').where('ktPlace.idx = :idx', { idx: place.idx });
    } else if (placeType === PlaceType.Skt) {
      queryBuilder.leftJoinAndSelect('reviewPost.sktPlace', 'sktPlace').where('sktPlace.idx = :idx', { idx: place.idx });
    } else {
      queryBuilder.leftJoinAndSelect('reviewPost.extraPlace', 'extraPlace').where('extraPlace.idx = :idx', { idx: place.idx });
    }

    if (query.limit) {
      queryBuilder.take(query.limit);
    }

    if (query.offset) {
      queryBuilder.skip(query.offset);
    }

    if (query.searchTerm) {
      queryBuilder.andWhere(`reviewPost.content LIKE '%${query.searchTerm}%'`);
    }

    queryBuilder.orderBy('reviewPost.createdDate', 'DESC');

    const [results, count] = await queryBuilder.getManyAndCount();
    return [results.map((result) => new ReviewPostEntity(result)), count];
  }
}