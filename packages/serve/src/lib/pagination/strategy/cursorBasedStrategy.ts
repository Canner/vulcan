import { KoaRouterContext } from '@vulcan/serve/route';
import { normalizeStringValue, PaginationMode } from '@vulcan/core';
import { PaginationStrategy } from './strategy';

export interface CursorPagination {
  limit: number;
  cursor: string;
}

export class CursorBasedStrategy extends PaginationStrategy<CursorPagination> {
  public async transform(ctx: KoaRouterContext) {
    const checkFelidInQueryString = ['limit', 'cursor'].every((field) =>
      Object.keys(ctx.request.query).includes(field)
    );
    if (!checkFelidInQueryString)
      throw new Error(
        `The ${PaginationMode.CURSOR} must provide limit and cursor in query string.`
      );
    const limitVal = ctx.request.query['limit'] as string;
    const cursorVal = ctx.request.query['cursor'] as string;
    return {
      limit: normalizeStringValue(limitVal, 'limit', Number.name),
      cursor: normalizeStringValue(cursorVal, 'cursor', String.name),
    } as CursorPagination;
  }
}