import { IsString } from 'class-validator';

class CreatePokemonDTO {
  @IsString()
  public name: string;

  @IsString()
  public types: string[];

  @IsString()
  public image_url: string;
}

export default CreatePokemonDTO;
