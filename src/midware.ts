import { Boom, handleError } from "@ycs/error";
import { IContext } from "@ycs/interfaces";
import * as compose from 'koa-compose';

export function owns(model) {
  return compose([
    this.isAuthenticated(),
    async (ctx: IContext, next) => {
      try {
        const entity = await model.findById(ctx.params.id, '__auth').exec();
        if (!entity['__auth'].equals(ctx.request.auth._id))
          throw Boom.forbidden('');
        ctx.request.auth.owns = true;
        await next();
      } catch (e) {
        handleError(ctx, e);
      }
    },
  ]);
};