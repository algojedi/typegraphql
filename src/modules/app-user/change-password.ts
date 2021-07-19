import { AppUser } from '../../entity/AppUser'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { MyContext } from '../../types/context'
import { redis } from '../../redis'
import { forgotPasswordPrefix } from './forgot-password'
import bcrypt from 'bcryptjs'
import { ChangePasswordInput } from './change-password-input'

@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => AppUser, { nullable: true })
    async changePassword(
        @Arg('data')
        { token, password }: ChangePasswordInput,
        @Ctx() ctx: MyContext
    ): Promise<AppUser | null> {
        const userId = await redis.get(forgotPasswordPrefix + token)

        if (!userId) {
            return null
        }

        const user = await AppUser.findOne(userId)

        if (!user) {
            // this shouldn't occur
            return null
        }

        await redis.del(forgotPasswordPrefix + token)

        user.password = await bcrypt.hash(password, 12)

        await user.save()

        // log in the user after successfully changing password.. good practice?
        ctx.req.session!.userId = user.id

        return user
    }
}
