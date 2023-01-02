import { ObjectType, Field, ID } from 'type-graphql';


@ObjectType()
class Company {
    @Field((type) => ID, { nullable: false })
    id: string;

    @Field((type) => String, { nullable: false })
    name: string;

    @Field((type) => String, { nullable: false })
    description: string;
}


export default Company;