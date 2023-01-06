import { MaxLength, Length, ArrayMaxSize } from 'class-validator';
import { Arg, Field, FieldResolver, InputType, Mutation, Query, Resolver, Root } from 'type-graphql';
import AuthorService from '../model-services/author-service';
import RecipeService from '../model-services/recipe-service';
import Recipe from '../object-types/recipe-object-type';


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


export default RecipeResolver;