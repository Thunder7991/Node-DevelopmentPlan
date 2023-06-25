import { Injectable, Inject } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Page } from './page.mongo.entity';
import { ObjectID } from 'mongodb'
import { STATUS_TYPE } from './page.mongo.entity';

@Injectable()
export class PageService {
  constructor(
    @Inject('PAGE_REPOSITORY')
    private pageRepository: MongoRepository<Page>,
  ) { }

  save(page) {
    return this.pageRepository.save(page)
  }

  findOne(id) {
    return this.pageRepository.findOne(id)
  }


  findAll() {
    return this.pageRepository.find()
  }


  findOneByQuery(params) {
    return this.pageRepository.findOne({
      where: {
        ...params
      }
    })
  }

  updateOne(id, page) {
    return this.pageRepository.findOneAndUpdate(
      { "_id": new ObjectID(id) },
      { $set: { ...page } },
      { upsert: true }
    )
  }

}
