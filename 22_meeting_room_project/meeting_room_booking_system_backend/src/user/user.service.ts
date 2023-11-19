import {
  Injectable,
  Logger,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './RegisterUserDto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';

@Injectable()
export class UserService {
  // 日志打印
  private logger = new Logger();

  //创建
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Inject(RedisService)
  private readonly redisService: RedisService;
  async register(user: RegisterUserDto) {
    console.log(user);
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    console.log(42, User);
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;
    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }
}
