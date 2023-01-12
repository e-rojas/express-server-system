import { AuthChecker } from 'type-graphql';




interface ContextType {
    // user: User;
    user: {
        id: string;
        name: string;
        email: string;
        companyId: string;
    }
}

export const customAuthChecker: AuthChecker<ContextType> = (
    { root, args, context: { user }, info },
    roles,
) => {
    // console.log('context: ', user);

    // const { user } = context;
    if (!user) {
        return false;
    }
    // console.log('root: ', root);
    // console.log('args:  ', args);
    // console.log('roles: ', roles);
    // console.log('context: ', user);
    // console.log('info: ', info);

    // here you can read user from context
    // and check his permission in db against `roles` argument
    // that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"]

    return true; // or false if access denied
};