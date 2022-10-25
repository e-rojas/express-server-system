import express from 'express';
import pokemonModel from '../models/pokemon.model';
import CreatePokemonDTO from '../DTO/pokemon.dto';
class PokemonsController {
  public path = '/pokemons';
  public router = express.Router();
  private pokemon = pokemonModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPokemons);
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

  private postPokemon = (req: express.Request, res: express.Response) => {
    const pokemonData: CreatePokemonDTO = req.body;
    const createdPokemon = new this.pokemon(pokemonData);
    createdPokemon
      .save()
      .then((savedPokemon) => {
        res.send(savedPokemon);
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Error during saving pokemon',
          error: err,
        });
      });
  };
}

export default PokemonsController;
