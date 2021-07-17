import bcrypt from 'bcryptjs'
import { Mutation, Ctx, Resolver, Arg } from 'type-graphql'
import { MyContext } from '../../../types/context'
import { AppUser } from '../../../entity/AppUser';
// , Args, ArgsType
// @ArgsType()
// class AppUserLoginArgs {
//     email: string
//     password: string
// }

@Resolver()
export class LoginResolver {
    @Mutation(() => AppUser, { nullable: true })
    async login(
      //  @Args() { email, password }: AppUserLoginArgs,
        @Arg("email") email: string,
    @Arg("password") password: string,
        @Ctx() ctx: MyContext
    ): Promise<AppUser | null> {
        const user = await AppUser.findOne({ where: { email } })
        if (!user) {
            return null
        }
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            return null
        }

        // return null if the user has no confirmed his email address
        if (!user.confirmed) return null

        ctx.req.session!.userId = user.id
        return user
    }
}
