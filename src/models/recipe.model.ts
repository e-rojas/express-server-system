import mongoose from 'mongoose';

interface Recipe {
    id: string;
    title: string;
    description: string;
    creationDate: Date;
    ingredients: string[];
    author: string;
}

const recipeSchema = new mongoose.Schema({
    title: String,
    description: String,
    creationDate: Date,
    ingredients: [String],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
    },
});

const RecipeModel = mongoose.model<Recipe & mongoose.Document>('Recipe', recipeSchema);
export default RecipeModel;

/*
const { _doc: { id } } = JSON.parse(JSON.stringify(author));
        const recipes = await this.recipeService.getRecipes();
        const authorRecipes = recipes.filter((recipe) => {
            const { _doc: { author: recipeAuthor } } = JSON.parse(JSON.stringify(recipe));
            return recipeAuthor.toString() === id.toString();
        });
        return authorRecipes;
*/