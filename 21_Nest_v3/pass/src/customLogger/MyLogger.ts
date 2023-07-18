import {
  LoggerService,
  LogLevel,
  ConsoleLogger,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AppService } from 'src/app.service';

//重写
export class MyLogger implements LoggerService {
  log(message: string, context: string) {
    console.log(`---log---[${context}]---`, message);
  }
  error(message: string, context: string) {
    console.log(`---error---[${context}]---`, message);
  }
  warn(message: string, context: string) {
    console.log(`---warn---[${context}]---`, message);
  }
}

//继承
export class MyLogger2 extends ConsoleLogger {
  log(message, context) {
    console.log(`[${context}]`, message);
    console.log('--------------');
  }
}

@Injectable()
export class MyLogger3 extends ConsoleLogger {
  @Inject(AppService)
  private appService: AppService;

  log(message, context) {
    console.log(this.appService.getHello());
    console.log(`[${context}]`, message);
    console.log('--------------');
  }
}

@Injectable()
export class MyLogger4 extends ConsoleLogger {
  @Inject('LOG_OPTIONS')
  public options: Record<string, any>;

  log(message, context) {
    console.log(49, this.options);

    console.log(`[${context}]`, message);
    console.log('--------------');
  }
}
