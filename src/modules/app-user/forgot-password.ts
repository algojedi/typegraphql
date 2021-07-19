import { AppUser } from '../../entity/AppUser'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { redis } from '../../redis'
import { sendEmail } from '../utils/sendEmail'
import { v4 } from 'uuid'

export const confirmUserPrefix = 'user-confirmation:'
// TODO: set confirm user prefix to confirm user
export const forgotPasswordPrefix = 'forgot-password:'

@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() => Boolean)
    async forgotPassword(@Arg('email') email: string): Promise<boolean> {
        const user = await AppUser.findOne({ where: { email } })

        if (!user) {
            return true
            // TODO: send some kind of error message indicating no user
        }

        const token = v4()
        await redis.set(
            forgotPasswordPrefix + token,
            user.id,
            'ex',
            60 * 60 * 24
        ) // 1 day expiration

        // TODO: in production, should be sending different template
        await sendEmail(
            email,
            `http://localhost:3000/user/change-password/${token}`
        )
        return true
    }
}
