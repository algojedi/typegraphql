import { ChangePasswordResolver } from "../modules/app-user/change-password";
import { buildSchema } from "type-graphql";
import { ConfirmUserResolver } from "../modules/app-user/confirm-user";
import { ForgotPasswordResolver } from "../modules/app-user/forgot-password";
import { LoginResolver } from "../modules/app-user/login/login";
import { LogoutResolver } from "../modules/app-user/logout/logout";
import { MeResolver } from "../modules/app-user/me";
import { RegisterResolver } from "../modules/app-user/register/register";

export const createSchema = () =>
  buildSchema({
    resolvers: [
      ChangePasswordResolver,
      ConfirmUserResolver,
      ForgotPasswordResolver,
      LoginResolver,
      LogoutResolver,
      MeResolver,
      RegisterResolver
    ],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    }
  });