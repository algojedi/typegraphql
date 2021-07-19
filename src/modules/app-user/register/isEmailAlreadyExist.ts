import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator'
import { AppUser } from '../../../entity/AppUser'

/** a module to help us create custom decorators
 * since email is already set to be unique, this class isn't really needed
 */

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint
    implements ValidatorConstraintInterface
{
    validate(email: string) {
        return AppUser.findOne({ where: { email } }).then((user) => {
            if (user) return false
            return true
        })
    }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyExistConstraint
        })
    }
}
