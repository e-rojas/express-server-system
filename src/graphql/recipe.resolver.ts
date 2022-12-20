import { MaxLength, Length, ArrayMaxSize } from 'class-validator';
import { Resolver, Query, ObjectType, Field, ID, Arg, Mutation, InputType } from 'type-graphql'


@InputType()
class NewRecipeInput {
    @Field()
    @MaxLength(30)
    title: string;

    @Field(type => String)
    @Length(30, 255)
    description: string;

    @Field(type => [String])
    @ArrayMaxSize(30)
    ingredients: string[];
}

@ObjectType()
class Recipe {

    @Field(type => ID)
    id: string;

    @Field(type => String)
    title: string;

    @Field(type => String)
    description: string;

    @Field(type => Date)
    creationDate: Date;

    @Field(type => [String])
    ingredients: string[];
}

@Resolver(Recipe)
class RecipeResolver {
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
        return `Hello ${name}`
    }

    @Query(() => Recipe)
    async recipe(@Arg('id') id: string) {
        return this.recipeService.findById(id);
    }

    @Mutation(() => Recipe)
    async createRecipe(
        @Arg('newRecipeData') { title, description, ingredients }: NewRecipeInput,
    ) {
        return await this.recipeService.createRecipe(title, description, ingredients);
    }


    /*  @Mutation(returns => Recipe)
     @Authorized()
     addRecipe(
       @Arg("newRecipeData") newRecipeData: NewRecipeInput,
       @Ctx("user") user: User,
     ): Promise<Recipe> {
       return this.recipeService.addNew({ data: newRecipeData, user });
     } */






}




class RecipeService {
    private recipes: Recipe[] = [];

    constructor() {
        this.recipes.push({
            id: '1',
            title: 'Pizza',
            description: 'A delicious pizza',
            creationDate: new Date(),
            ingredients: ['cheese', 'tomato', 'dough'],
        } as Recipe);
    }

    public getRecipes(): Recipe[] {
        return this.recipes;
    }

    public findById(id: string): Recipe {
        return this.recipes.find(recipe => recipe.id === id) as Recipe;
    }

    public createRecipe(title: string, description: string, ingredients: string[]): Recipe {
        const recipe = {
            id: '2',
            title: title,
            description: description,
            creationDate: new Date(),
            ingredients: ingredients,
        } as Recipe;
        this.recipes.push(recipe);
        return recipe;
    }

    public updateRecipe(id: string, recipe: Recipe): Recipe {
        const index = this.recipes.findIndex(recipe => recipe.id === id);
        this.recipes[index] = recipe;
        return recipe;
    }

    public deleteRecipe(id: string): Recipe {
        const recipe = this.recipes.find(recipe => recipe.id === id) as Recipe;
        this.recipes = this.recipes.filter(recipe => recipe.id !== id);
        return recipe;
    }

}

export default RecipeResolver;