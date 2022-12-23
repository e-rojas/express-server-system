
import { Resolver, Arg, FieldResolver, Root, Query } from 'type-graphql';
import AuthorService from '../model-services/author-service';
import RecipeService from '../model-services/recipe-service';
import Author from '../object-types/author-object-type';


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
        return recipes;

    }


}

export default AuthorResolver;