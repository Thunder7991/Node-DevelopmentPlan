import { Injectable } from '@nestjs/common';
import { CreateMangerDto } from './dto/create-manger.dto';
import { UpdateMangerDto } from './dto/update-manger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manger } from './entities/manger.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MangerService {
  constructor(
    @InjectRepository(Manger) private readonly money: Repository<Manger>,
  ) {}
  create(createMangerDto: CreateMangerDto) {
    return 'This action adds a new manger';
  }

  findAll() {
    return `This action returns all manger`;
  }
  async transferMoney(tranferMoneyDto: transferMoneyDto) {
    try {
      return this.money.manager.transaction(async (manager) => {
        const from = this.money.findOne({
          where: { id: tranferMoneyDto.fromId },
        });
        const to = this.money.findOne({
          where: { id: tranferMoneyDto.toId },
        });

        if (from.money >= tranferMoneyDto.money) {
          //事务
          manager.save(Manger, {
            id: tranferMoneyDto.fromId,
            money: from.money - tranferMoneyDto.money,
          });
          manager.save(Manger, {
            id: tranferMoneyDto.toId,
            money: from.to.money + tranferMoneyDto.money,
          });
          return {
            message: '转账成功',
          };
        } else {
          return {
            message: '余额不足',
          };
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} manger`;
  }

  update(id: number, updateMangerDto: UpdateMangerDto) {
    return `This action updates a #${id} manger`;
  }

  remove(id: number) {
    return `This action removes a #${id} manger`;
  }
}
