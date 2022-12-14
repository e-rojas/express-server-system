import { IsString } from 'class-validator';
export default class CreateUserDTO {
  @IsString()
  public name: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;
}
