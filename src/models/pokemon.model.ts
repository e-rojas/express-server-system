import mongoose from 'mongoose';
import Pokemon from '../interfaces/pokemon.interface';

const pokemonSchema = new mongoose.Schema({
  name: String,
  types: [String],
  image_url: String,
  saved: Boolean,
});

const PokemonModel = mongoose.model<Pokemon & mongoose.Document>(
  'Pokemon',
  pokemonSchema
);
export default PokemonModel;
