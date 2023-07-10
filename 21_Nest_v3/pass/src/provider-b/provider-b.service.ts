import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ProviderAService } from '../provider-a/provider-a.service';

@Injectable()
export class ProviderBService {
  constructor(
    @Inject(forwardRef(() => ProviderAService))
    private providerAService: ProviderAService,
  ) {}
  ccc() {
    return 'ccc';
  }
  eee() {
    return this.providerAService.providerAservice();
  }
}
