import { Resolver, Arg, FieldResolver, Root, Query } from 'type-graphql';

import CompanyModel from '../../models/company.model';
import EmploymentModel from '../../models/employment.model';
import Company from '../object-types/company.object-type';
@Resolver(Company)
export class CompanyResolver {

    @Query(() => Company)
    async company(@Arg('id') id: string) {
        return await CompanyModel
            .findById(id)
            .exec();
    }

    @Query(() => [Company]!)
    async companies() {
        return await CompanyModel
            .find({})
            .exec();
    }

    @FieldResolver()
    async jobs(@Root() company: Company) {
        const { _doc: { _id: id } } = JSON.parse(JSON.stringify(company));
        const jobs = await EmploymentModel
            .find({ company: id })
            .exec();
        return jobs;
    }
};

export default CompanyResolver;