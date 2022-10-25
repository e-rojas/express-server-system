import HttpException from './HttpException';

class PokemonWithNameAlreadyExistExecption extends HttpException {
  constructor(name: string) {
    super(409, `Pokemon with name ${name} already exists`);
  }
}

export default PokemonWithNameAlreadyExistExecption;
