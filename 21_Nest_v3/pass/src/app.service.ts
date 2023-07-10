import { Injectable } from '@nestjs/common';
import { ProviderAService } from './provider-a/provider-a.service';
import { ProviderBService } from './provider-b/provider-b.service';

@Injectable()
export class AppService {
  constructor(
    private ProviderAService: ProviderAService,
    private ProviderBService: ProviderBService,
  ) {}
  getHello(): string {
    // return 'Hello World!';
    return (
      this.ProviderAService.providerAservice() + this.ProviderBService.eee()
    );
  }
}
