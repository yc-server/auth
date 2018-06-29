import { Boom, handleError } from '@ycs/error';
import { IContext } from '@ycs/interfaces';

export function hasRoles(...roles: string[]) {
  return async (ctx: IContext, next) => {
    try {
      for (const role of roles) {
        if (!ctx.request.auth.roles.includes(role))
          throw Boom.forbidden(this.config.messages.errors.no_permission);
      }
      await next();
    } catch (e) {
      handleError(ctx, e);
    }
  };
}
