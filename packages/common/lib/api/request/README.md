# Request types

These type definitions describe valid bodies, url parameters, and query
parameters for various routes. In update routes, null should be used to indicate
that an optional value should be removed.

NOTE: _All dates and times are ISO 8601 strings._

The files should consist of something like:

```typescript
export interface CreateSomeRouteBody {
  aTextValue: string;
  startDateTime: string; // Date and time
  endTime: string; // Time only
  birthDate: string; // Date only
  aComplexOptionalValue?: string;
  count: number;
  // Neither of these are in the parsed body:
  isOk?: boolean;
  problem?: string;
}

// If necessary:
export interface ParsedCreateSomeRouteBody {
  aTextValue: string;
  startDateTime: DateTime;
  endTime: DateTime;
  birthDate: Date;
  aComplexOptionalValue: {
    [key: string]: string;
  };
  count: number;
}

export type EditSomeRouteBody = CreateBodyToEditBody<CreateSomeRouteBody>;

export type ParsedEditSomeRouteBody =
  CreateBodyToEditBody<ParsedCreateSomeRouteBody>;

export interface GetSomeRouteParams {
  id: string;
}

export interface ListSomeRoutesQuery
  extends SortingOptions,
    PaginationOptions {}
```

Remember to update the relevant server-side validator when modifying these
files.
