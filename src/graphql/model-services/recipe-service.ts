import mongoose from 'mongoose';
import AuthorModel from '../../models/author.model';
import RecipeModel from '../../models/recipe.model';
import Recipe from '../object-types/recipe-object-type';


class RecipeService {
    private recipe = RecipeModel;
    private author = AuthorModel;

    public typeObject(_id: string) {
        const id = new mongoose.Types.ObjectId(_id);
        return id;
    }

    public async getRecipes(): Promise<Recipe[]> {
        return await this.recipe.find({});
    }

    public async findById(id: string): Promise<Recipe> {
        return (await this.recipe.findOne({ id })) as Recipe;
    }

    public async findRecipesByAuthor(authorId: string): Promise<Recipe[]> {
        const ID = this.typeObject(authorId);
        const recipesbyAuthor = (await this.recipe.find({ author: ID })) as Recipe[];
        return recipesbyAuthor;

    }

    public async updateRecipe(
        id: string,
        title: string,
        description: string,
        ingredients: string[]
    ): Promise<Recipe> {
        const recipe = {
            title: title,
            description: description,
            ingredients: ingredients,
        } as Recipe;

        return (await this.recipe.findByIdAndUpdate(id, recipe, {
            new: true,
        })) as Recipe;
    }
}


export default RecipeService;