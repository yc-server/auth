import { IContext } from "@ycs/interfaces";

export function getHeaderToken(ctx: IContext): string | null {
  if (
    !ctx.headers.authorization ||
    !ctx.headers.authorization.startsWith('Bearer ')
  )
    return null;
  return ctx.headers.authorization.substring(7);
}