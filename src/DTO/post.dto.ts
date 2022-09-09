import { IsString } from 'class-validator';

class CreatePostDTO {
  @IsString()
  public title: string;

  @IsString()
  public content: string;

  @IsString()
  public author: string;
}

export default CreatePostDTO;
