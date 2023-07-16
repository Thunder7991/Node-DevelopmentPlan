import { IsInt } from 'class-validator';

export class CreateTestPipeDto {
  name: string;
  @IsInt()
  age: number;
  sex: boolean;
  hobbies: Array<string>;
}
