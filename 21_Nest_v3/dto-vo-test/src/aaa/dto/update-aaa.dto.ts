import { IntersectionType } from '@nestjs/mapped-types';
import { CreateAaaDto } from './create-aaa.dto';


export class UpdateAaaDto extends IntersectionType(CreateAaaDto) {   
}
