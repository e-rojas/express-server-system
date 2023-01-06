import { ObjectType, Field, ID } from 'type-graphql';
import Employment from './employment.object-type';


@ObjectType()
class Company {
    @Field((type) => ID, { nullable: false })
    id: string;

    @Field((type) => String, { nullable: false })
    name: string;

    @Field((type) => String, { nullable: false })
    description: string;

    @Field((type) => [Employment], { nullable: false })
    jobs: Employment[];
}


export default Company;