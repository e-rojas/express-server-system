import * as bcrypt from 'bcrypt';
import { Resolver, Arg, FieldResolver, Root, Query, Mutation, AuthChecker } from 'type-graphql';
import UserModel from '../../models/user.model';
import jwt from 'jsonwebtoken';
import User from '../object-types/user.object-type';
import dotenv from 'dotenv';
import { Context } from 'vm';
dotenv.config();

@Resolver(User)
export class UserResolver {
    @Mutation(() => String)

    async createUser(
        @Arg('name') name: string,
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Arg('companyId') companyId: string,
    ) {
        const userExists = await UserModel
            .findOne({ email })
            .exec();
        if (userExists) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            companyId,
        });
        const token = this.createToken(user._id);
        return token;
    }

    @Mutation(() => String)
    async loginUser(
        @Arg('email') email: string,
        @Arg('password') password: string,
    ) {
        const user = await UserModel
            .findOne({ email })
            .exec();
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordMatching = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordMatching) {
            throw new Error('Invalid password');
        }
        const token = this.createToken(user._id);
        return token;
    }

    private createToken(id: string) {
        const token = jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: 86400 })
        return token;
    }





};


export default UserResolver;
