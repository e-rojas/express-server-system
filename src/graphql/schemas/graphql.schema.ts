import AuthorResolver from '../resolvers/author-resolver';
import RecipeResolver from '../resolvers/recipe-resolver';
import EmploymentResolver from '../resolvers/employment-resolver';
import CompanyResolver from '../resolvers/company-resolver';
import UserResolver from '../resolvers/user-resolver';
import UserModel from '../../models/user.model';
import { NonEmptyArray } from 'type-graphql';
import { ContextFunction } from 'apollo-server-core';

export const resolvers = [
    RecipeResolver,
    AuthorResolver,
    EmploymentResolver,
    CompanyResolver,
    UserResolver,
] as NonEmptyArray<Function>;


// export const context = ({ req }: any) => ({ }) as unknown as ContextFunction<any, object>;
export const context: ContextFunction<any, object> = async ({ req }) => {
    if (req.auth) {
        const user = await UserModel.findById(req.auth.id).select('-password -__v');
        return { user };
    }
    return {};
}