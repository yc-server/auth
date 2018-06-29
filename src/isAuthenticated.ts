import { Boom, handleError } from "@ycs/error";
import { IContext } from "@ycs/interfaces";

export function isAuthenticated() {
  return async (ctx: IContext, next) => {
    try {
      if (!ctx.request.auth)
        throw Boom.unauthorized(this.config.messages.errors.unauthorized);
      const auth = await this.model.findById(ctx.request.auth._id).exec();
      if (!auth)
        throw Boom.notAcceptable(
          this.config.messages.errors.invalid_token
        );
      await next();
    } catch (e) {
      handleError(ctx, e);
    }
  };
};