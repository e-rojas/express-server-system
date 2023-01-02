import { ObjectType, Field, ID } from 'type-graphql';
import Author from './author-object-type';


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

export default Recipe;