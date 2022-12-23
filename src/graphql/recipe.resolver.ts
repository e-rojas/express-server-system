import { MaxLength, Length, ArrayMaxSize } from 'class-validator';
import { log } from 'console';
import mongoose from 'mongoose';

import {
    Resolver,
    Query,
    ObjectType,
    Field,
    ID,
    Arg,
    Mutation,
    InputType,
    FieldResolver,
    Root,
} from 'type-graphql';
import AuthorModel from '../models/author.model';
import RecipeModel from '../models/recipe.model';

@InputType()
class NewRecipeInput {
    @Field()
    @MaxLength(30)
    title: string;

    @Field((type) => String)
    @Length(30, 255)
    description: string;

    @Field((type) => [String])
    @ArrayMaxSize(30)
    ingredients: string[];
}

@ObjectType()
class Author {
    @Field((type) => ID)
    id: string;

    @Field((type) => String)
    name: string;

    @Field((type) => String)
    email: string;

    @Field((type) => [Recipe])
    recipes: Recipe[];
}

@ObjectType()
class Recipe {
    @Field((type) => ID)
    id: string;

    @Field((type) => String)
    title: string;

    @Field((type) => String)
    description: string;

    @Field((type) => Date)
    creationDate: Date;

    @Field((type) => [String])
    ingredients: string[];

    @Field((type) => Author)
    author: Author;
}

@Resolver(Author)
export class AuthorResolver {
    private authorService: AuthorService = new AuthorService();
    private recipeService: RecipeService = new RecipeService();

    @Query(() => Author)
    async author(@Arg('id') id: string) {
        return this.authorService.getAuthor(id);
    }

    @Query(() => [Author])
    async authors() {
        return this.authorService.getAuthors();
    }

    @FieldResolver()
    async recipes(@Root() author: Author) {
        const { _doc: { _id: id } } = JSON.parse(JSON.stringify(author));
        const recipes = await this.recipeService.findRecipesByAuthor(id);

        // const recipes = await this.recipeService.getRecipes();
        // const authorRecipes = recipes.filter((recipe) => {
        //     const { _doc: { author: recipeAuthor } } = JSON.parse(JSON.stringify(recipe));
        //     return recipeAuthor.toString() === id.toString();
        // });
        // return authorRecipes
        return recipes;

    }


}

@Resolver(Recipe)
export class RecipeResolver {
    private authorService: AuthorService = new AuthorService();
    private recipeService: RecipeService = new RecipeService();

    @Query(() => String)
    async hello() {
        return 'Hello World';
    }

    @Query(() => [Recipe])
    async recipes() {
        return this.recipeService.getRecipes();
    }

    @Query(() => String)
    async getName(@Arg('name') name: string) {
        return `Hello ${name}`;
    }

    @Query(() => Recipe)
    async recipe(@Arg('id') id: string) {
        return this.recipeService.findById(id);
    }

    @FieldResolver()
    async author(@Root() recipe: Recipe) {
        const { _doc: { author: id } } = JSON.parse(JSON.stringify(recipe));
        const authorData = await this.authorService.getAuthor(id);
        return authorData;


    }



    @Mutation(() => Recipe)
    async updateRecipe(
        @Arg('id') id: string,
        @Arg('newRecipeData') { title, description, ingredients }: NewRecipeInput
    ) {
        return await this.recipeService.updateRecipe(
            id,
            title,
            description,
            ingredients
        );
    }
}

class AuthorService {
    private author = AuthorModel;

    public async getAuthor(id: string): Promise<Author> {
        return await this.author.findById(id) as Author;
    }

    public async getAuthors(): Promise<Author[]> {
        return await this.author.find({});
    }

    public typeObject(_id: string) {
        const id = new mongoose.Types.ObjectId(_id);
        return id;
    }
}

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
