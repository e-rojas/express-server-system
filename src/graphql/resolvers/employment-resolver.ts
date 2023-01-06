import { Resolver, Arg, FieldResolver, Root, Query } from 'type-graphql';

import EmploymentModel from '../../models/employment.model';
import Employment from '../object-types/employment.object-type';
import CompanyModel from '../../models/company.model';
@Resolver(Employment)
export class EmploymentResolver {

    @Query(() => Employment)
    async job(@Arg('id') id: string) {
        return await EmploymentModel
            .findById(id)
            .exec();
    }

    @Query(() => [Employment]!)
    async jobs() {
        return await EmploymentModel
            .find({})
            .exec();
    }

    @FieldResolver()
    async company(@Root() employment: Employment) {
        const { _doc: { company: id } } = JSON.parse(JSON.stringify(employment));
        const company = await CompanyModel
            .findById(id)
            .exec();
        return company;
    }
};

export default EmploymentResolver;