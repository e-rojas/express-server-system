import express, { NextFunction } from 'express';
import pokemonModel from '../models/pokemon.model';
import CreatePokemonDTO from '../DTO/pokemon.dto';
import PokemonWithNameAlreadyExistExecption from '..//exceptions//PokemonWithNameAlreadyExistExecption.exception';
class PokemonsController {
  public path = '/pokemons';
  public router = express.Router();
  private pokemon = pokemonModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPokemons);
    this.router.post(this.path, this.createPokemon);
  }

  private getAllPokemons = (req: express.Request, res: express.Response) => {
    this.pokemon
      .find()
      .then((pokemons) => {
        res.send(pokemons);
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Error during getting all pokemons',
          error: err,
        });
      });
  };

  private createPokemon = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    const pokemonData: CreatePokemonDTO = req.body;
    if (await this.pokemon.findOne({ name: pokemonData.name })) {
      next(new PokemonWithNameAlreadyExistExecption(pokemonData.name));
    } else {
      const createdPokemon = new this.pokemon({
        ...pokemonData,
        saved: true,
      });
      createdPokemon
        .save()
        .then((savedPokemon) => {
          res.send(savedPokemon);
        })
        .catch((err) => {
          res.status(500).json({
            message: 'Error during creating pokemon',
            error: err,
          });
        });
    }
  };
}

export default PokemonsController;
