import { ObjectType, Field, ID } from 'type-graphql';
import Company from './company.object-type';

@ObjectType()
class Employment {
    @Field((type) => ID, { nullable: false })
    id: string;

    @Field((type) => Company)
    company: Company;

    // @Field((type) => String, { nullable: false })
    // company: string;

    @Field((type) => String, { nullable: false })
    title: string;

    @Field((type) => String, { nullable: false })
    description: string;
}

export default Employment;