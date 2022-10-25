import { IsString } from 'class-validator';

class CreatePokemonDTO {
  @IsString()
  public name: string;

  @IsString()
  public type: string;

  @IsString()
  public category: string;
}

export default CreatePokemonDTO;
