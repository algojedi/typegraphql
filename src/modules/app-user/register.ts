import { Length } from 'class-validator'
import {
    Resolver,
    Query,
    ArgsType,
    Field,
    Mutation,
    Args,
    FieldResolver,
    Root
} from 'type-graphql'
import * as bcrypt from 'bcryptjs'
import { AppUser } from '../../entity/AppUser'

const salt = 12

@ArgsType()
class AppUserArgs {
    @Field()
    @Length(3, 10)
    firstName: string

    @Field()
    @Length(3, 10)
    lastName: string

    @Field()
    @Length(3, 20)
    email: string

    @Field()
    @Length(3, 14)
    password: string
}

@Resolver(AppUser) // explicitly declared that we are resolving for AppUser
export class RegisterResolver {
    @Query(() => String, {
        // String is a graphql type
        name: 'firstShit',
        description: 'I am trying to learn about graphql'
    })
    async helloWorld() {
        // this will be the name of the query, unless overridden by obj with name field above
        return 'Hello World!'
    }
    @FieldResolver()
    name(@Root() parent: AppUser) { // function name must match field to be resolved
        return `${parent.firstName + ' ' + parent.lastName}`
    }

    @Mutation(() => AppUser) // graphql query should return AppUser 
    async register(
        @Args() { firstName, lastName, email, password }: AppUserArgs
    ): Promise<AppUser> {  // return type is for typescript intellisense
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await AppUser.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        }).save() //.catch(err => console.log('oops.. something went wrong, user not created', err))
        return user
    }
}
