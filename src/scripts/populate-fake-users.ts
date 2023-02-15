import {faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import UserModel from '../models/user.model';
import dotenv from 'dotenv';
dotenv.config();
const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;


mongoose
    .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`)
    .then(() => {
        console.log('⚡️[db connection]: success!! ヽ(ヅ)ノ');
    }
    )
    .then(() => {
        UserModel.insertMany(users)
            .then(() => {
                console.log('users created');
                mongoose.connection.close();
            }
            );
    })
    .catch((err) => {
        console.log('⚡️[db connection]: error', err);
    }
    );

    const companiesIds = ['63b30ca1bb2ec9c3401e0468', '63b30cccbb2ec9c3401e0469', '63b30cdabb2ec9c3401e046a']
    const users = Array.from({ length: 10 }).map(() => {
        return {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            companyId: companiesIds[Math.floor(Math.random() * companiesIds.length)],
        };
    }
    );
    