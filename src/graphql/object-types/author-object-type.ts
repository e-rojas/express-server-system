import { ObjectType, Field, ID } from 'type-graphql';
import Recipe from './recipe-object-type';


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

export default Author;