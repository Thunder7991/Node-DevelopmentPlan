import { Inject, Injectable } from '@nestjs/common';
import { ProviderAService } from './provider-a/provider-a.service';
import { ProviderBService } from './provider-b/provider-b.service';
import { MyLogger4 } from './customLogger/MyLogger';

@Injectable()
export class AppService {
  constructor(
    private ProviderAService: ProviderAService,
    private ProviderBService: ProviderBService, // @Inject(MyLogger4) private logger: MyLogger4,
  ) {}

  getHello(): string {
    // return 'Hello World!';
    // this.logger.log('yyy', AppService.name);
    return (
      this.ProviderAService.providerAservice() + this.ProviderBService.eee()
    );
  }
}
