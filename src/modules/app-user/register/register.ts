import { IsEmail, Length, MinLength } from 'class-validator'
import {
    Resolver,
    Query,
    ArgsType,
    Field,
    Mutation,
    Args,
    UseMiddleware,
    Arg
} from 'type-graphql'
import bcrypt from 'bcryptjs'
import { AppUser } from '../../../entity/AppUser'
import { isAuth } from '../../middleware/isAuth'
import { logger } from '../../middleware/logger'
import { sendEmail } from '../../../modules/utils/sendEmail'
import { createConfirmationUrl } from '../../../modules/utils/createConfirmationUrl'
import { IsEmailAlreadyExist } from './isEmailAlreadyExist'

const salt = 12

@ArgsType()
export class AppUserArgs { //} extends PasswordInput {
    @Field()
    @Length(3, 10)
    firstName: string

    @Field()
    @Length(3, 10)
    lastName: string

    @Field()
    @IsEmail()
    @IsEmailAlreadyExist({ message: 'email already in use' })
    email: string

    @Field()
    @MinLength(5)
    password: string // TODO: not sure why graphql doesn't recognize this if factored out by PasswordInput
}

@Resolver() // explicitly declared that we are resolving for AppUser
export class RegisterResolver {
    // @UseMiddleware(isAuth, logger) // authentication based on client cookie
    // @Query(() => String, {
    //     // String is a graphql type
    //     name: 'firstShit',
    //     description: 'I am trying to learn about graphql'
    // })
    // async helloWorld() {
    //     // this will be the name of the query, unless overridden by obj with name field above
    //     return 'Hello World!'
    // }


    @Mutation(() => AppUser) // graphql query should return AppUser
    async register(
        @Args() { firstName, lastName, email, password }: AppUserArgs
    ): Promise<AppUser> {
        // return type is for typescript intellisense
        const hashedPassword = await bcrypt.hash(password, salt)
        // TODO: the password creation process should be separate module
        const user = await AppUser.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        }).save() //.catch(err => console.log('oops.. something went wrong, user not created', err))

        await sendEmail(email, await createConfirmationUrl(user.id))

        return user
    }
}
