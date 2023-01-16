import { Resolver, Arg, FieldResolver, Root, Query, Mutation, Authorized, Ctx } from 'type-graphql';

import EmploymentModel from '../../models/employment.model';
import Employment from '../object-types/employment.object-type';
import CompanyModel from '../../models/company.model';

interface Context {
    user: {
        id: string;
        name: string;
        email: string;
        companyId: string;
    };
}
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
    @Authorized()
    @Mutation(() => Employment)
    async createJob(
        @Arg('title') title: string,
        @Arg('description') description: string,
        @Ctx() ctx: Context,
    ) {
        if (!ctx.user) {
            throw new Error("You are not authenticated");

        }
         const { user: { companyId } } = ctx;


        const job = await EmploymentModel.create({
            title,
            description,
            company: companyId,
        });
        return job;
    }
    @Authorized()
    @Mutation(() => Employment)
    async deleteJob(@Arg('id') id: string, @Ctx() ctx: Context) {
        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }

        const job = await EmploymentModel.findOne({ _id: id, company: ctx.user.companyId });


        if (!job) {
            throw new Error("You are not authorized to delete this job");
        }

        const deletedJob = await EmploymentModel.findByIdAndDelete(id);
        return deletedJob;
    }

    @Authorized()
    @Mutation(() => Employment)
    async updateJob(
        @Arg('id') id: string,
        @Arg('title') title: string,
        @Arg('description') description: string,
        @Ctx() ctx: Context,

    ) {
        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }

        const jobExists = await EmploymentModel.findOne({ _id: id, company: ctx.user.companyId });

        if (!jobExists) {
            throw new Error("You are not authorized to update this job");
        }

        const job = await EmploymentModel.findByIdAndUpdate
            (id, {
                title,
                description,
                company: ctx.user.companyId,
            }, { new: true });
        return job;
    }



};

export default EmploymentResolver;