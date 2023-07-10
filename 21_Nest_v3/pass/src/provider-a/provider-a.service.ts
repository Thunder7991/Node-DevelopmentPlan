import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ProviderBService } from '../provider-b/provider-b.service';

@Injectable()
export class ProviderAService {
  constructor(
    @Inject(forwardRef(() => ProviderBService))
    private providerBService: ProviderBService,
  ) {}
  providerAservice() {
    return this.providerBService.ccc();
  }
}
